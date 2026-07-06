import { NextRequest } from 'next/server';
import { fetchWeatherData, normalizeWeatherData } from '@/services/weather/weather.service';
import { fetchForecast } from '@/services/weather/forecast.service';
import { runBusinessEngine } from '@/lib/business-engine/engine';
import { cache } from '@/lib/cache';
import { rateLimiter } from '@/lib/rateLimiter';
import { logger } from '@/utils/logger';
import { BusinessScenario } from '@/types';
import { API_CACHE_TTL_MS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  if (!rateLimiter.isAllowed(ip)) {
    logger.warn('api/analyze', 'Rate limit exceeded', { ip });
    return Response.json({ error: 'Too many requests. Please wait before retrying.' }, { status: 429 });
  }

  const { searchParams } = request.nextUrl;
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');
  const scenario = searchParams.get('scenario') as BusinessScenario | null;
  const units = (searchParams.get('units') || 'metric') as 'metric' | 'imperial';
  const locationName = searchParams.get('location') || 'Unknown Location';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const thresholdsParam = searchParams.get('thresholds');
  let customThresholds: Record<string, number> | undefined = undefined;
  if (thresholdsParam) {
    try { customThresholds = JSON.parse(thresholdsParam); } catch (e) {}
  }

  if (!latStr || !lonStr || !scenario) {
    return Response.json({ error: 'Missing required parameters: lat, lon, scenario' }, { status: 400 });
  }

  const lat = Math.round(parseFloat(latStr) * 1000) / 1000;
  const lon = Math.round(parseFloat(lonStr) * 1000) / 1000;

  if (isNaN(lat) || isNaN(lon)) {
    return Response.json({ error: 'Invalid coordinate values' }, { status: 400 });
  }

  const cacheKey = `analyze:${lat}:${lon}:${scenario}:${units}:${date}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.info('api/analyze', 'Cache hit', { cacheKey });
    return Response.json(cached);
  }

  try {
    const startMs = Date.now();
    const [rawWeather, forecast] = await Promise.all([
      fetchWeatherData({ lat, lon, units }),
      fetchForecast(lat, lon, units),
    ]);

    const normalized = normalizeWeatherData(rawWeather, units);

    const report = runBusinessEngine(
      scenario,
      {
        temperature: normalized.temperature,
        feelsLike: normalized.feelsLike,
        humidity: normalized.humidity,
        windSpeed: normalized.windSpeed,
        windGust: normalized.windGust,
        visibility: normalized.visibility,
        cloudCover: normalized.cloudCover,
        uvIndex: normalized.uvIndex,
        rainProbability: normalized.rainProbability,
        rainAmount: normalized.rainAmount,
        snowAmount: normalized.snowAmount,
        conditionId: normalized.conditionId,
        condition: normalized.condition,
        sunrise: normalized.sunrise,
        sunset: normalized.sunset,
        units,
        customThresholds,
      },
      locationName,
      date,
    );

    const payload = {
      report,
      weather: normalized,
      forecast: forecast.daily.slice(0, 3),
      meta: { lat, lon, units, cachedAt: new Date().toISOString(), processingMs: Date.now() - startMs },
    };

    cache.set(cacheKey, payload, API_CACHE_TTL_MS);
    logger.info('api/analyze', 'Analysis complete', { lat, lon, scenario, riskScore: report.riskScore.value });
    return Response.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error('api/analyze', 'Analysis failed', { error: message, lat, lon, scenario });
    return Response.json({ error: 'Failed to fetch weather data. Please try again.' }, { status: 502 });
  }
}
