import { WeatherInput, ScenarioResult, clamp, isStorm, isRain, isSnow, buildTimeline, getOperationalStatus } from '../types';

export function analyzeConstruction(w: WeatherInput): ScenarioResult {
  let score = 0;

  // Custom thresholds configuration
  const windLimit = w.customThresholds?.constructionWindLimit ?? 14;
  const windWarning = w.customThresholds?.constructionWindWarning ?? 10;
  const rainLimit = w.customThresholds?.constructionRainLimit ?? 25;
  const rainWarning = w.customThresholds?.constructionRainWarning ?? 10;
  const tempMaxLimit = w.customThresholds?.constructionTempMaxLimit ?? 38;
  const tempMaxWarning = w.customThresholds?.constructionTempMaxWarning ?? 34;
  const tempMinLimit = w.customThresholds?.constructionTempMinLimit ?? 2;

  // Wind speed (crane operations)
  const windRisk = w.windSpeed > windLimit ? 40 : w.windSpeed > windWarning ? 25 : w.windSpeed > (windWarning * 0.7) ? 10 : 0;
  const gustRisk = w.windGust > (windLimit * 1.3) ? 20 : w.windGust > (windWarning * 1.4) ? 12 : 0;
  // Rain (concrete & structural work)
  const rainRisk = w.rainAmount > rainLimit ? 35 : w.rainAmount > rainWarning ? 20 : w.rainProbability > 70 ? 12 : w.rainProbability > 40 ? 5 : 0;
  // Thunderstorm → immediate halt
  const stormRisk = isStorm(w.conditionId) ? 50 : 0;
  // Extreme heat (worker safety)
  const heatRisk = w.temperature > tempMaxLimit ? 20 : w.temperature > tempMaxWarning ? 10 : w.temperature > (tempMaxWarning - 4) ? 4 : 0;
  // Extreme cold
  const coldRisk = w.temperature < (tempMinLimit - 7) ? 15 : w.temperature < tempMinLimit ? 8 : 0;
  // Snow / ice
  const snowRisk = isSnow(w.conditionId) ? 20 : 0;
  // Fog / poor visibility
  const visRisk = w.visibility < 0.5 ? 15 : w.visibility < 1 ? 8 : 0;
  // UV
  const uvRisk = w.uvIndex > 9 ? 10 : w.uvIndex > 7 ? 5 : 0;

  score = clamp(windRisk + gustRisk + rainRisk + stormRisk + heatRisk + coldRisk + snowRisk + visRisk + uvRisk, 0, 100);

  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  const alerts = [];
  const actions = [];
  const impacts: ScenarioResult['impactAreas'] = [];

  // Build contextual risk factors
  if (w.windSpeed > windLimit) keyRisks.push(`Sustained wind at ${Math.round(w.windSpeed)} m/s exceeds crane operating limits (${windLimit} m/s)`);
  else if (w.windSpeed > windWarning) keyRisks.push(`Wind speed at ${Math.round(w.windSpeed)} m/s approaching crane limits`);
  if (w.windGust > (windLimit * 1.3)) keyRisks.push(`Gusts of ${Math.round(w.windGust)} m/s pose risk to elevated structures`);
  if (isStorm(w.conditionId)) keyRisks.push('Thunderstorm detected — lightning risk to all personnel and equipment');
  if (w.rainAmount > rainWarning) keyRisks.push(`Expected ${Math.round(w.rainAmount)}mm rainfall impacts concrete curing and slip hazards`);
  if (w.temperature > tempMaxWarning) keyRisks.push(`Temperature ${Math.round(w.temperature)}°C — elevated heat stress risk for outdoor workers`);
  if (w.temperature < tempMinLimit) keyRisks.push(`Near-freezing temperature — risk of ice on scaffolding and machinery`);
  if (isSnow(w.conditionId)) keyRisks.push('Snowfall conditions increase fall risk on elevated surfaces');
  if (w.visibility < 1) keyRisks.push(`Reduced visibility (${w.visibility.toFixed(1)} km) impacts site safety protocols`);

  if (w.windSpeed <= (windWarning * 0.7)) positive.push('Wind speed within safe crane operating range');
  if (w.rainProbability < 20) positive.push('Low precipitation probability — favorable for concrete work');
  if (!isStorm(w.conditionId)) positive.push('No thunderstorm activity detected');
  if (w.temperature >= 10 && w.temperature <= (tempMaxWarning - 4)) positive.push('Comfortable temperature for outdoor work');

  // Alerts
  if (isStorm(w.conditionId)) alerts.push({ type: 'lightning', severity: 'critical' as const, title: 'Lightning Strike Risk', description: 'Thunderstorm activity detected in the area. All elevated work must immediately cease.', suggestedAction: 'Evacuate crane operators and all workers from elevated positions. Suspend all steel erection.', icon: 'Zap' });
  if (w.windSpeed > windLimit) alerts.push({ type: 'high_wind', severity: 'critical' as const, title: 'Dangerous Wind Speed', description: `Sustained winds of ${Math.round(w.windSpeed)} m/s exceed the maximum safe crane operating speed.`, suggestedAction: `Ground all cranes and secure all lifted loads before wind increases further. Limit: ${windLimit} m/s.`, icon: 'Wind' });
  if (w.windSpeed > windWarning && w.windSpeed <= windLimit) alerts.push({ type: 'high_wind', severity: 'warning' as const, title: 'High Wind Advisory', description: `Wind speed at ${Math.round(w.windSpeed)} m/s. Monitor crane load charts closely.`, suggestedAction: 'Reduce crane working radius and suspend oversized load operations.', icon: 'Wind' });
  if (w.temperature > tempMaxLimit) alerts.push({ type: 'extreme_heat', severity: 'critical' as const, title: 'Extreme Heat Alert', description: `Temperature of ${Math.round(w.temperature)}°C poses serious health risk to site workers.`, suggestedAction: `Enforce mandatory rest breaks, provide shade stations, and increase hydration monitoring. Limit: ${tempMaxLimit}°C.`, icon: 'Thermometer' });
  if (w.rainAmount > rainWarning) alerts.push({ type: 'heavy_rain', severity: 'warning' as const, title: 'Heavy Rainfall Alert', description: `${Math.round(w.rainAmount)}mm of rainfall expected. Surfaces and access roads will be affected.`, suggestedAction: 'Cover all fresh concrete work. Inspect scaffold footings and drainage paths.', icon: 'CloudRain' });

  // Impact areas
  impacts.push({ area: 'Crane & Lifting', riskLevel: w.windSpeed > windLimit || isStorm(w.conditionId) ? 'critical' : w.windSpeed > windWarning ? 'high' : 'low', explanation: `Wind at ${Math.round(w.windSpeed)} m/s ${w.windSpeed > windLimit ? 'prohibits' : 'limits'} safe crane operations.`, icon: 'MoveUp' });
  impacts.push({ area: 'Concrete Work', riskLevel: w.rainAmount > rainLimit ? 'high' : w.rainProbability > 50 ? 'moderate' : 'minimal', explanation: `${w.rainAmount > rainWarning ? 'Heavy rain will wash freshly poured concrete.' : 'Conditions acceptable for concrete placement.'}`, icon: 'Layers' });
  impacts.push({ area: 'Worker Safety', riskLevel: w.temperature > tempMaxLimit || isStorm(w.conditionId) ? 'critical' : w.temperature > tempMaxWarning || w.windSpeed > windLimit ? 'high' : 'low', explanation: `Heat index ${Math.round(w.feelsLike)}°C and wind conditions affect outdoor worker health.`, icon: 'Users' });
  impacts.push({ area: 'Site Access', riskLevel: w.rainAmount > (rainLimit * 0.8) ? 'high' : w.visibility < 1 ? 'moderate' : 'minimal', explanation: `${w.rainAmount > (rainLimit * 0.8) ? 'Heavy rain may make access roads impassable for heavy vehicles.' : 'Access conditions are acceptable.'}`, icon: 'Route' });

  // Recommended actions
  if (w.windSpeed > windLimit || isStorm(w.conditionId)) actions.push({ priority: 'urgent' as const, category: 'Safety', action: 'Ground all cranes immediately', rationale: 'Wind speed or storm conditions exceed safe operating envelope' });
  if (w.rainAmount > rainWarning) actions.push({ priority: 'high' as const, category: 'Quality', action: 'Postpone all concrete pours', rationale: `${Math.round(w.rainAmount)}mm of rain will compromise mix integrity and curing` });
  if (w.temperature > (tempMaxLimit - 6)) actions.push({ priority: 'high' as const, category: 'Health', action: 'Activate heat management protocol', rationale: 'Distribute water, enforce 15-min rest every hour, set up shaded rest areas' });
  if (w.windSpeed > (windWarning * 0.7)) actions.push({ priority: 'medium' as const, category: 'Operations', action: 'Reduce crane working radius by 15%', rationale: 'Precautionary measure per BS 7121 for elevated wind conditions' });
  if (w.rainProbability > 50) actions.push({ priority: 'medium' as const, category: 'Equipment', action: 'Cover and secure all materials', rationale: 'Protect materials from rain damage and prevent waterlogged access paths' });
  actions.push({ priority: 'low' as const, category: 'Planning', action: 'Brief site supervisor on weather forecast', rationale: 'Ensure all team leads are aware of evolving conditions throughout the day' });

  // Timeline risk variation
  const tRisks = [
    clamp(score * 0.7, 0, 100),
    clamp(score * 1.0, 0, 100),
    clamp(score * 0.85, 0, 100),
    clamp(score * 0.5, 0, 100),
  ];

  const recommendation = score > 80
    ? 'All construction operations should cease immediately. Crane operations are prohibited. Remove all workers from elevated positions.'
    : score > 60
      ? `Suspend crane and concrete operations. Ground-level work may continue with enhanced safety protocols.`
      : score > 40
        ? `Proceed with caution. Monitor wind speed continuously. Limit crane radius and avoid elevated structural work.`
        : `Conditions are acceptable for normal site operations. Apply standard safety protocols.`;

  return {
    riskScore: score,
    operationalStatus: status,
    executiveSummary: `Construction operations at this location have been assessed as ${score > 60 ? 'high' : score > 40 ? 'moderate' : 'acceptable'} risk. ${keyRisks[0] || 'Conditions are within operational limits.'}`,
    operationalRecommendation: recommendation,
    keyRisks,
    positiveFactors: positive,
    alerts: alerts.map((a, i) => ({ ...a, id: `alert-${i}` })),
    impactAreas: impacts,
    recommendedActions: actions.map((a, i) => ({ ...a, id: `action-${i}` })),
    timeline: buildTimeline(w, tRisks),
  };
}
