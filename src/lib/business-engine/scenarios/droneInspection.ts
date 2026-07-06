import { WeatherInput, ScenarioResult, clamp, isStorm, buildTimeline, getOperationalStatus } from '../types';

export function analyzeDroneInspection(w: WeatherInput): ScenarioResult {
  // Drones are extremely sensitive to wind, rain, and visibility
  let score = 0;
  const windRisk = w.windSpeed > 12 ? 60 : w.windSpeed > 8 ? 35 : w.windSpeed > 5 ? 15 : 0;
  const gustRisk = w.windGust > 15 ? 25 : w.windGust > 10 ? 12 : 0;
  const rainRisk = w.rainProbability > 50 ? 40 : w.rainProbability > 20 ? 20 : 0;
  const visRisk = w.visibility < 1 ? 50 : w.visibility < 3 ? 25 : 0;
  const stormRisk = isStorm(w.conditionId) ? 100 : 0;
  score = clamp(Math.max(stormRisk, windRisk + gustRisk + rainRisk + visRisk), 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isStorm(w.conditionId)) keyRisks.push('Active thunderstorm — all drone operations strictly prohibited by aviation authority');
  if (w.windSpeed > 8) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s — exceeds safe operating envelope for commercial drones`);
  if (w.windGust > 10) keyRisks.push(`Gusts of ${Math.round(w.windGust)} m/s create unpredictable flight path instability`);
  if (w.rainProbability > 20) keyRisks.push('Precipitation risk — moisture ingress hazard for drone electronics');
  if (w.visibility < 3) keyRisks.push(`Reduced visibility (${w.visibility.toFixed(1)} km) — BVLOS operations not permissible`);
  if (w.windSpeed < 5) positive.push('Wind speed within optimal drone operating range');
  if (w.rainProbability < 10) positive.push('Negligible precipitation probability — safe for electronics');
  if (w.visibility > 5) positive.push('Excellent visibility — BVLOS operations permissible');

  const alerts = [];
  if (isStorm(w.conditionId)) alerts.push({ id: 'a1', type: 'storm', severity: 'critical' as const, title: 'All Drone Operations Prohibited', description: 'Thunderstorm activity creates immediate risk of lightning strike and loss of drone control.', suggestedAction: 'Ground all drones immediately. Secure equipment in weatherproof cases. Do not fly until all-clear issued.', icon: 'CloudLightning' });
  if (w.windSpeed > 8) alerts.push({ id: 'a2', type: 'wind', severity: 'critical' as const, title: 'Wind Speed Exceeds Drone Limits', description: `${Math.round(w.windSpeed)} m/s wind exceeds the operational envelope for standard commercial drones (typically 8 m/s).`, suggestedAction: 'Cancel all inspection flights. Rebook for sub-5 m/s conditions.', icon: 'Wind' });
  if (w.rainProbability > 50) alerts.push({ id: 'a3', type: 'rain', severity: 'warning' as const, title: 'Moisture Risk Alert', description: 'Significant rain probability threatens drone electronics and motors.', suggestedAction: 'Only proceed with IP-rated drones. Have recovery plan if weather deteriorates mid-flight.', icon: 'CloudRain' });

  const impacts = [
    { area: 'Flight Operations', riskLevel: (score > 60 ? 'critical' : score > 30 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Wind and weather conditions ${score > 40 ? 'prohibit' : 'allow'} safe commercial drone flight.`, icon: 'Radio' },
    { area: 'Sensor Accuracy', riskLevel: (w.cloudCover > 80 ? 'high' : w.cloudCover > 50 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `${w.cloudCover}% cloud cover affects LiDAR and optical sensor performance.`, icon: 'ScanLine' },
    { area: 'Equipment Safety', riskLevel: (w.rainProbability > 30 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Rain and moisture risk to drone electronics and camera systems.', icon: 'Shield' },
    { area: 'Mission Completion', riskLevel: (score > 50 ? 'high' : score > 20 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Weather may force early mission abort or incomplete coverage.', icon: 'CheckCircle' },
  ];

  const actions = [];
  if (score > 50) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Operations', action: 'Ground all drone assets', rationale: 'Conditions are outside safe operating parameters for all drone classes' });
  if (w.windSpeed > 5 && w.windSpeed <= 8) actions.push({ id: 'r2', priority: 'high' as const, category: 'Flight Planning', action: 'Restrict to low-altitude inspection only', rationale: 'Higher altitude wind speeds likely exceed drone limits — stay below 30m AGL' });
  actions.push({ id: 'r3', priority: 'medium' as const, category: 'Compliance', action: 'File weather-hold NOTAM with aviation authority', rationale: 'Document weather-related ground hold for regulatory compliance' });
  actions.push({ id: 'r4', priority: 'low' as const, category: 'Planning', action: 'Re-schedule to next suitable window', rationale: 'Forecast clear window suitable for operations' });

  const tRisks = [clamp(score * 0.7, 0, 100), clamp(score, 0, 100), clamp(score * 0.85, 0, 100), clamp(score * 0.4, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Drone inspection operations are ${score > 60 ? 'not viable' : score > 30 ? 'restricted' : 'viable'} under current conditions. ${keyRisks[0] || 'Weather conditions permit safe drone operations.'}`,
    operationalRecommendation: score > 60 ? 'All drone operations must be grounded. Conditions exceed safe operating parameters. Rebook for next available window.' : score > 30 ? 'Limited drone operations possible. Restrict to low-altitude, short-range VLOS missions only.' : 'Drone inspection operations can proceed. Follow standard pre-flight weather assessment protocol.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}
