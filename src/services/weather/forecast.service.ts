import { WeatherAPIResponse } from './types';
import { fetchWeatherData } from './weather.service';

export interface DailyForecastSummary {
  dt: number;
  date: string;
  dayLabel: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  conditionId: number;
  icon: string;
  humidity: number;
  windSpeed: number;
  windGust: number;
  rainProbability: number;
  rainAmount: number;
  uvIndex: number;
  cloudCover: number;
  summary: string;
}

export interface HourlyForecastSummary {
  dt: number;
  hour: string;
  temp: number;
  condition: string;
  icon: string;
  windSpeed: number;
  rainProbability: number;
  rainAmount: number;
  humidity: number;
  visibility: number;
}

export interface ForecastData {
  daily: DailyForecastSummary[];
  hourly: HourlyForecastSummary[];
  raw: WeatherAPIResponse;
}

function formatDate(dt: number): string {
  return new Date(dt * 1000).toISOString().split('T')[0];
}

function getDayLabel(dt: number, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  return new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
}

function formatHour(dt: number): string {
  return new Date(dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export async function fetchForecast(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial' = 'metric'
): Promise<ForecastData> {
  const raw = await fetchWeatherData({ lat, lon, units });

  const daily: DailyForecastSummary[] = raw.daily.slice(0, 7).map((d, i) => ({
    dt: d.dt,
    date: formatDate(d.dt),
    dayLabel: getDayLabel(d.dt, i),
    tempMin: d.temp.min,
    tempMax: d.temp.max,
    condition: d.weather[0]?.main || 'Unknown',
    conditionId: d.weather[0]?.id || 800,
    icon: d.weather[0]?.icon || '01d',
    humidity: d.humidity,
    windSpeed: d.wind_speed,
    windGust: d.wind_gust || d.wind_speed * 1.3,
    rainProbability: d.pop * 100,
    rainAmount: d.rain || 0,
    uvIndex: d.uvi,
    cloudCover: d.clouds,
    summary: d.summary || '',
  }));

  const hourly: HourlyForecastSummary[] = raw.hourly.slice(0, 48).map(h => ({
    dt: h.dt,
    hour: formatHour(h.dt),
    temp: h.temp,
    condition: h.weather[0]?.main || 'Unknown',
    icon: h.weather[0]?.icon || '01d',
    windSpeed: h.wind_speed,
    rainProbability: h.pop * 100,
    rainAmount: h.rain?.['1h'] || 0,
    humidity: h.humidity,
    visibility: h.visibility / 1000,
  }));

  return { daily, hourly, raw };
}
