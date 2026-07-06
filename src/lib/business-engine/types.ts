import { RiskLevel, OperationalStatus, OperationalReport, RiskScore, OperationalAlert, ImpactArea, TimelineSlot, RecommendedAction } from '@/types';

// ─── Business Engine Types ────────────────────────────────────────────────────

export interface WeatherInput {
  temperature: number;      // °C
  feelsLike: number;
  humidity: number;         // %
  windSpeed: number;        // m/s
  windGust: number;         // m/s
  visibility: number;       // km
  cloudCover: number;       // %
  uvIndex: number;
  rainProbability: number;  // %
  rainAmount: number;       // mm/day
  snowAmount: number;
  conditionId: number;      // Weather condition code
  condition: string;
  sunrise: number;          // Unix timestamp
  sunset: number;
  units: 'metric' | 'imperial';
  customThresholds?: Record<string, number>;
}

export interface ScenarioResult {
  riskScore: number;
  operationalStatus: OperationalStatus;
  executiveSummary: string;
  operationalRecommendation: string;
  keyRisks: string[];
  positiveFactors: string[];
  alerts: Omit<OperationalAlert, 'id'>[];
  impactAreas: ImpactArea[];
  recommendedActions: Omit<RecommendedAction, 'id'>[];
  timeline: Omit<TimelineSlot, never>[];
}

// ─── Risk scoring helpers ─────────────────────────────────────────────────────

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 20) return 'minimal';
  if (score <= 40) return 'low';
  if (score <= 60) return 'moderate';
  if (score <= 80) return 'high';
  return 'critical';
}

export function getOperationalStatus(score: number): OperationalStatus {
  if (score <= 20) return 'GO';
  if (score <= 40) return 'PROCEED_WITH_CAUTION';
  if (score <= 60) return 'DELAY_RECOMMENDED';
  if (score <= 80) return 'HALT_OPERATIONS';
  return 'CRITICAL_HALT';
}

export function buildRiskScore(value: number): RiskScore {
  const level = getRiskLevel(value);
  const colorMap: Record<RiskLevel, string> = {
    minimal: '#22c55e',
    low: '#84cc16',
    moderate: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
  };
  const bgMap: Record<RiskLevel, string> = {
    minimal: 'bg-green-50 dark:bg-green-950/30',
    low: 'bg-lime-50 dark:bg-lime-950/30',
    moderate: 'bg-amber-50 dark:bg-amber-950/30',
    high: 'bg-orange-50 dark:bg-orange-950/30',
    critical: 'bg-red-50 dark:bg-red-950/30',
  };
  const labelMap: Record<RiskLevel, string> = {
    minimal: 'Minimal Risk',
    low: 'Low Risk',
    moderate: 'Moderate Risk',
    high: 'High Risk',
    critical: 'Critical',
  };
  return { value, level, label: labelMap[level], color: colorMap[level], bgColor: bgMap[level] };
}

export function isStorm(conditionId: number): boolean {
  return conditionId >= 200 && conditionId < 300;
}

export function isRain(conditionId: number): boolean {
  return (conditionId >= 300 && conditionId < 400) || (conditionId >= 500 && conditionId < 600);
}

export function isSnow(conditionId: number): boolean {
  return conditionId >= 600 && conditionId < 700;
}

export function isHazardousAtmosphere(conditionId: number): boolean {
  return conditionId >= 700 && conditionId < 800;
}

// ─── Timeline builder ─────────────────────────────────────────────────────────

export function buildTimeline(weather: WeatherInput, riskByPeriod: number[]): TimelineSlot[] {
  const periods: Array<{ period: 'Morning' | 'Afternoon' | 'Evening' | 'Night'; timeRange: string }> = [
    { period: 'Morning', timeRange: '06:00 – 12:00' },
    { period: 'Afternoon', timeRange: '12:00 – 18:00' },
    { period: 'Evening', timeRange: '18:00 – 22:00' },
    { period: 'Night', timeRange: '22:00 – 06:00' },
  ];

  const condIcons = ['🌤️', '⛅', '🌧️', '🌙'];
  const condTexts = [
    `${weather.condition}, ${Math.round(weather.temperature)}°, ${Math.round(weather.rainProbability)}% rain`,
    `${weather.condition}, wind ${Math.round(weather.windSpeed)} m/s`,
    `${weather.condition}, ${Math.round(weather.humidity)}% humidity`,
    `${weather.condition}, ${Math.round(weather.cloudCover)}% cloud`,
  ];

  return periods.map((p, i) => {
    const risk = clamp(riskByPeriod[i] || 0, 0, 100);
    const level = getRiskLevel(risk);
    return {
      period: p.period,
      timeRange: p.timeRange,
      riskScore: risk,
      riskLevel: level,
      forecast: condTexts[i],
      icon: condIcons[i],
      recommendation: risk <= 30
        ? 'Conditions are favorable for operations.'
        : risk <= 60
          ? 'Proceed with standard precautions.'
          : 'Consider delaying non-essential operations.',
      temperature: weather.temperature,
      rainProbability: weather.rainProbability,
    };
  });
}
