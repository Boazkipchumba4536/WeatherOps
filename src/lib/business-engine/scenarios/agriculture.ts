import { WeatherInput, ScenarioResult, clamp, isStorm, isRain, isSnow, buildTimeline, getOperationalStatus } from '../types';

export function analyzeAgriculture(w: WeatherInput): ScenarioResult {
  let score = 0;
  const rainRisk = isStorm(w.conditionId) ? 45 : w.rainAmount > 25 ? 30 : w.rainAmount > 10 ? 15 : w.rainProbability > 70 ? 12 : 0;
  const windRisk = w.windSpeed > 12 ? 30 : w.windSpeed > 8 ? 15 : 0;
  const heatRisk = w.temperature > 38 ? 20 : w.temperature > 35 ? 10 : 0;
  const humidityRisk = w.humidity > 85 ? 20 : w.humidity > 75 ? 10 : 0;
  const frostRisk = w.temperature < 2 ? 35 : w.temperature < 5 ? 15 : 0;
  score = clamp(rainRisk + windRisk + heatRisk + humidityRisk + frostRisk, 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (frostRisk > 0) keyRisks.push(`Near-freezing temperature (${Math.round(w.temperature)}°C) — frost damage risk to crops`);
  if (w.rainAmount > 10) keyRisks.push(`${Math.round(w.rainAmount)}mm rainfall prevents spraying and harvest operations`);
  if (w.windSpeed > 8) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s — spray drift exceeds safe application limits`);
  if (w.humidity > 80) keyRisks.push(`High humidity (${Math.round(w.humidity)}%) promotes fungal disease spread`);
  if (w.temperature >= 12 && w.temperature <= 28) positive.push('Ideal temperature range for crop growth and field operations');
  if (w.rainProbability < 20) positive.push('Low rain probability — suitable for spraying and harvesting');
  if (w.windSpeed < 5) positive.push('Calm conditions — optimal for pesticide and fertiliser application');

  const alerts = [];
  if (w.temperature < 2) alerts.push({ id: 'a1', type: 'frost', severity: 'critical' as const, title: 'Frost Risk Alert', description: `Temperature of ${Math.round(w.temperature)}°C poses immediate frost damage risk to vulnerable crops.`, suggestedAction: 'Activate frost protection systems. Deploy irrigation as frost protection if available.', icon: 'Snowflake' });
  if (w.windSpeed > 8) alerts.push({ id: 'a2', type: 'spray_drift', severity: 'warning' as const, title: 'Spray Drift Advisory', description: `Wind speed of ${Math.round(w.windSpeed)} m/s creates unacceptable spray drift risk. Legal limits may be exceeded.`, suggestedAction: 'Suspend all pesticide and fertiliser spraying operations. Re-schedule for calm conditions.', icon: 'Wind' });
  if (w.humidity > 80) alerts.push({ id: 'a3', type: 'disease_risk', severity: 'warning' as const, title: 'Disease Pressure Alert', description: `High humidity of ${Math.round(w.humidity)}% creates optimal conditions for fungal and bacterial disease spread.`, suggestedAction: 'Increase disease monitoring frequency. Prepare fungicide intervention plan.', icon: 'Bug' });

  const impacts = [
    { area: 'Spraying Operations', riskLevel: (w.windSpeed > 8 || w.rainProbability > 50 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Wind and rain conditions ${w.windSpeed > 8 ? 'prohibit safe' : 'allow'} pesticide application.`, icon: 'Droplets' },
    { area: 'Harvest Operations', riskLevel: (w.rainAmount > 10 ? 'high' : w.humidity > 80 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `${w.rainAmount > 10 ? 'Wet conditions prevent harvesting.' : 'Soil and crop conditions are acceptable for harvest.'}`, icon: 'Wheat' },
    { area: 'Crop Health', riskLevel: (frostRisk > 0 ? 'critical' : w.humidity > 80 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Frost and disease pressure based on current temperature and humidity.`, icon: 'Sprout' },
    { area: 'Field Access', riskLevel: (w.rainAmount > 20 ? 'high' : w.rainAmount > 10 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `${w.rainAmount > 10 ? 'Saturated ground conditions — heavy machinery may cause soil compaction.' : 'Ground conditions allow machinery access.'}`, icon: 'Tractor' },
  ];

  const actions = [];
  if (w.temperature < 3) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Crop Protection', action: 'Activate frost protection immediately', rationale: `Temperature at ${Math.round(w.temperature)}°C — crops at immediate risk of freeze damage` });
  if (w.windSpeed > 8) actions.push({ id: 'r2', priority: 'high' as const, category: 'Spraying', action: 'Suspend all aerial and ground spray operations', rationale: 'Wind speed exceeds safe application limits — drift will waste chemicals and risk off-target damage' });
  if (w.rainAmount > 10) actions.push({ id: 'r3', priority: 'high' as const, category: 'Harvest', action: 'Postpone grain and hay harvesting', rationale: 'Wet conditions will compromise grain quality and prevent drying' });
  if (w.humidity > 80) actions.push({ id: 'r4', priority: 'medium' as const, category: 'Disease', action: 'Intensify crop disease scouting', rationale: 'High humidity promotes fungal growth — early detection prevents spread' });
  actions.push({ id: 'r5', priority: 'low' as const, category: 'Planning', action: 'Log soil moisture readings', rationale: 'Weather data will inform irrigation scheduling decisions' });

  const tRisks = [clamp(score * 0.5, 0, 100), clamp(score, 0, 100), clamp(score * 0.8, 0, 100), clamp(score * 0.6, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Agricultural operations face ${score > 60 ? 'high' : score > 30 ? 'moderate' : 'acceptable'} risk. ${keyRisks[0] || 'Field and crop conditions are within normal operating parameters.'}`,
    operationalRecommendation: score > 80 ? 'Suspend all field operations. Activate crop protection protocols immediately. Focus on damage mitigation.' : score > 60 ? 'Major operations should be suspended. Prioritise frost or disease protection actions.' : score > 30 ? 'Select operations can proceed. Avoid spraying and harvesting. Monitor conditions closely.' : 'Field operations can proceed normally. Maintain standard agronomic practices.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}
