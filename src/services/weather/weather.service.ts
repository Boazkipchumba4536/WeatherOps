import { WeatherAPIResponse, WeatherFetchParams, NormalizedWeather } from './types';

const API_BASE = process.env.WEATHER_API_BASE_URL || 'https://api.weather-ai.co/v1';
const API_KEY = process.env.WEATHER_API_KEY || '';
const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

// ─── Demo seed data ───────────────────────────────────────────────────────────

function buildDemoResponse(lat: number, lon: number): WeatherAPIResponse {
  const now = Math.floor(Date.now() / 1000);
  const baseTemp = 18 + Math.sin(lat * 0.1) * 8;
  const humidity = 55 + Math.abs(Math.sin(lon * 0.05)) * 30;
  const windSpeed = 3 + Math.abs(Math.cos(lat * 0.2)) * 12;
  const windGust = windSpeed * 1.5;
  const rainPop = Math.max(0, Math.min(1, Math.sin(now * 0.0001) * 0.5 + 0.3));
  const clouds = humidity > 70 ? 75 : 30;
  const uvIndex = Math.max(0, 7 - clouds / 20);

  const hourly = Array.from({ length: 48 }, (_, i) => ({
    dt: now + i * 3600,
    temp: baseTemp + Math.sin(i * 0.3) * 5,
    feels_like: baseTemp - 2 + Math.sin(i * 0.3) * 5,
    pressure: 1013 + Math.sin(i * 0.2) * 5,
    humidity: humidity + Math.sin(i * 0.4) * 10,
    dew_point: baseTemp - 10,
    uvi: i >= 6 && i <= 18 ? Math.max(0, uvIndex * Math.sin((i - 6) * Math.PI / 12)) : 0,
    clouds,
    visibility: Math.max(1000, 10000 - humidity * 50),
    wind_speed: windSpeed + Math.sin(i * 0.5) * 3,
    wind_deg: 180 + Math.sin(i * 0.3) * 90,
    wind_gust: windGust + Math.sin(i * 0.5) * 5,
    weather: [{ id: humidity > 70 ? 500 : 800, main: humidity > 70 ? 'Rain' : 'Clear', description: humidity > 70 ? 'light rain' : 'clear sky', icon: humidity > 70 ? '10d' : '01d' }],
    pop: rainPop,
    ...(humidity > 70 ? { rain: { '1h': rainPop * 5 } } : {}),
  }));

  const daily = Array.from({ length: 8 }, (_, i) => {
    const dayTemp = baseTemp + Math.sin(i * 0.5) * 6;
    return {
      dt: now + i * 86400,
      sunrise: now + 6 * 3600 + i * 86400,
      sunset: now + 19 * 3600 + i * 86400,
      moonrise: now + 20 * 3600 + i * 86400,
      moonset: now + 6 * 3600 + i * 86400,
      moon_phase: 0.5,
      summary: humidity > 70 ? 'Rainy day with moderate winds' : 'Clear skies with light breeze',
      temp: { day: dayTemp, min: dayTemp - 6, max: dayTemp + 5, night: dayTemp - 8, eve: dayTemp + 2, morn: dayTemp - 5 },
      feels_like: { day: dayTemp - 2, night: dayTemp - 10, eve: dayTemp, morn: dayTemp - 7 },
      pressure: 1013,
      humidity,
      dew_point: baseTemp - 10,
      wind_speed: windSpeed,
      wind_deg: 220,
      wind_gust: windGust,
      weather: [{ id: humidity > 70 ? 500 : 800, main: humidity > 70 ? 'Rain' : 'Clear', description: humidity > 70 ? 'moderate rain' : 'clear sky', icon: humidity > 70 ? '10d' : '01d' }],
      clouds,
      pop: rainPop,
      rain: humidity > 70 ? rainPop * 10 : 0,
      uvi: uvIndex,
    };
  });

  return {
    lat,
    lon,
    timezone: 'Auto/Local',
    timezone_offset: 0,
    current: {
      dt: now,
      sunrise: now + 6 * 3600,
      sunset: now + 19 * 3600,
      temp: baseTemp,
      feels_like: baseTemp - 2,
      pressure: 1013,
      humidity,
      dew_point: baseTemp - 10,
      uvi: uvIndex,
      clouds,
      visibility: Math.max(1000, 10000 - humidity * 50),
      wind_speed: windSpeed,
      wind_deg: 220,
      wind_gust: windGust,
      weather: [{ id: humidity > 70 ? 500 : 800, main: humidity > 70 ? 'Rain' : 'Clear', description: humidity > 70 ? 'light rain' : 'clear sky', icon: humidity > 70 ? '10d' : '01d' }],
      ...(humidity > 70 ? { rain: { '1h': rainPop * 3 } } : {}),
    },
    hourly,
    daily,
  };
}

// ─── HTTP utilities ──────────────────────────────────────────────────────────

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`WeatherAI API error ${res.status}: ${res.statusText}`);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (retries > 0 && !(err instanceof Error && err.name === 'AbortError')) {
      await new Promise(r => setTimeout(r, 500 * (MAX_RETRIES - retries + 1)));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

// ─── Main service ────────────────────────────────────────────────────────────

export async function fetchWeatherData(params: WeatherFetchParams): Promise<WeatherAPIResponse> {
  const { lat, lon, units = 'metric' } = params;

  if (!API_KEY) {
    console.warn('[WeatherService] No API key found — using demo data');
    return buildDemoResponse(lat, lon);
  }

  const url = new URL(`${API_BASE}/onecall`);
  url.searchParams.set('lat', lat.toFixed(3));
  url.searchParams.set('lon', lon.toFixed(3));
  url.searchParams.set('units', units);
  url.searchParams.set('exclude', 'minutely');
  url.searchParams.set('appid', API_KEY);

  const res = await fetchWithRetry(url.toString(), {
    headers: { 'Accept': 'application/json', 'User-Agent': 'WeatherOps/1.0' },
    next: { revalidate: 900 }, // 15 min ISR cache
  });
  return res.json() as Promise<WeatherAPIResponse>;
}

// ─── Normalize raw API data into our domain model ────────────────────────────

export function normalizeWeatherData(raw: WeatherAPIResponse, units: 'metric' | 'imperial' = 'metric'): NormalizedWeather {
  const c = raw.current;
  const now = Math.floor(Date.now() / 1000);
  const todayHourly = raw.hourly.slice(0, 24);
  const maxPop = Math.max(...todayHourly.map(h => h.pop));
  const totalRain = todayHourly.reduce((sum, h) => sum + (h.rain?.['1h'] || 0), 0);
  const totalSnow = todayHourly.reduce((sum, h) => sum + (h.snow?.['1h'] || 0), 0);

  return {
    temperature: c.temp,
    feelsLike: c.feels_like,
    humidity: c.humidity,
    pressure: c.pressure,
    windSpeed: c.wind_speed,
    windGust: c.wind_gust || c.wind_speed * 1.3,
    windDeg: c.wind_deg,
    visibility: c.visibility / 1000, // convert to km
    cloudCover: c.clouds,
    uvIndex: c.uvi,
    dewPoint: c.dew_point,
    rainProbability: maxPop * 100,
    rainAmount: totalRain,
    snowAmount: totalSnow,
    condition: c.weather[0]?.main || 'Unknown',
    conditionId: c.weather[0]?.id || 800,
    icon: c.weather[0]?.icon || '01d',
    sunrise: c.sunrise,
    sunset: c.sunset,
    isDay: now > c.sunrise && now < c.sunset,
    units,
  };
}
