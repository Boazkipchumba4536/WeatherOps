import { NextRequest } from 'next/server';
import { cache } from '@/lib/cache';
import { logger } from '@/utils/logger';
import { GEOCODE_CACHE_TTL_MS } from '@/lib/constants';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  if (!query || query.length < 2) {
    return Response.json({ results: [] });
  }

  const cacheKey = `geocode:${query.toLowerCase().trim()}`;
  const cached = cache.get(cacheKey);
  if (cached) return Response.json(cached);

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '6');
    url.searchParams.set('featuretype', 'city');

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'WeatherOps/1.0 (contact@weatherops.app)',
        'Accept-Language': 'en',
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
    const raw: NominatimResult[] = await res.json();

    const results = raw.map(r => ({
      id: r.place_id,
      name: r.address.city || r.address.town || r.address.village || r.display_name.split(',')[0],
      displayName: r.display_name,
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      country: r.address.country || '',
      countryCode: r.address.country_code?.toUpperCase() || '',
    }));

    const payload = { results };
    cache.set(cacheKey, payload, GEOCODE_CACHE_TTL_MS);
    return Response.json(payload);
  } catch (err) {
    logger.error('api/geocode', 'Geocoding failed', { error: String(err), query });
    return Response.json({ results: [] });
  }
}
