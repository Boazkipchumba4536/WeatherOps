'use client';

import { useState, useCallback } from 'react';
import { OperationalReport } from '@/types';
import { NormalizedWeather } from '@/services/weather/types';
import { DailyForecastSummary } from '@/services/weather/forecast.service';
import { AnalysisFormValues } from '@/types';

export type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; report: OperationalReport; weather: NormalizedWeather; forecast: DailyForecastSummary[] }
  | { status: 'error'; message: string };

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  const analyze = useCallback(async (values: AnalysisFormValues) => {
    setState({ status: 'loading' });

    try {
      let thresholds = null;
      if (typeof window !== 'undefined') {
        thresholds = localStorage.getItem('WEATHEROPS_SETTINGS_THRESHOLDS');
      }

      const params = new URLSearchParams({
        lat: values.lat.toFixed(4),
        lon: values.lon.toFixed(4),
        scenario: values.businessScenario,
        units: values.units,
        location: values.locationName,
        date: values.date,
      });

      if (thresholds) {
        params.append('thresholds', thresholds);
      }

      const res = await fetch(`/api/analyze?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      setState({
        status: 'success',
        report: data.report,
        weather: data.weather,
        forecast: data.forecast,
      });

      return data.report;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState({ status: 'error', message });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, analyze, reset };
}
