import { WeatherInput, ScenarioResult, clamp, isStorm, buildTimeline, getOperationalStatus } from '../types';

// Utility Maintenance (electrical grid, power lines)
export function analyzeUtilityMaintenance(w: WeatherInput): ScenarioResult {
  let score = 0;
  const windRisk = w.windSpeed > 15 ? 45 : w.windSpeed > 10 ? 25 : w.windSpeed > 7 ? 10 : 0;
  const stormRisk = isStorm(w.conditionId) ? 70 : 0;
  const rainRisk = w.rainAmount > 20 ? 20 : w.rainProbability > 60 ? 10 : 0;
  const heatRisk = w.temperature > 38 ? 15 : 0;
  const coldRisk = w.temperature < -10 ? 20 : w.temperature < 0 ? 10 : 0;
  score = clamp(Math.max(stormRisk, windRisk + rainRisk + heatRisk + coldRisk), 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isStorm(w.conditionId)) keyRisks.push('Thunderstorm — live electrical infrastructure poses lethal lightning hazard');
  if (w.windSpeed > 10) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s — aerial lift and line work prohibited above 10 m/s`);
  if (w.rainAmount > 20) keyRisks.push('Heavy rain creates electrical hazard on live and isolated equipment');
  if (!isStorm(w.conditionId)) positive.push('No lightning risk detected');
  if (w.windSpeed < 7) positive.push('Wind within safe aerial lift operating range');

  const alerts = [];
  if (isStorm(w.conditionId)) alerts.push({ id: 'a1', type: 'lightning', severity: 'critical' as const, title: 'Lightning Hazard — Suspend All Line Work', description: 'Thunderstorm activity creates immediate lethal risk on all live and de-energised electrical infrastructure.', suggestedAction: 'Immediately stand down all personnel from poles, towers, and elevated platforms. Do not resume until 30 min post-storm clearance.', icon: 'Zap' });
  if (w.windSpeed > 10) alerts.push({ id: 'a2', type: 'wind', severity: w.windSpeed > 15 ? 'critical' as const : 'warning' as const, title: 'Elevated Line Work Restricted', description: `Wind at ${Math.round(w.windSpeed)} m/s exceeds safe aerial lift operating limit.`, suggestedAction: 'Suspend all aerial lift and elevated platform operations. Ground-level maintenance may continue.', icon: 'Wind' });

  const impacts = [
    { area: 'Aerial Line Work', riskLevel: (isStorm(w.conditionId) || w.windSpeed > 10 ? 'critical' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Elevated work on live and de-energised lines affected by wind and storm.', icon: 'Zap' },
    { area: 'Ground Maintenance', riskLevel: (w.rainAmount > 20 ? 'high' : w.rainProbability > 60 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Ground-level maintenance possible but wet conditions add slip hazards.', icon: 'Wrench' },
    { area: 'Personnel Safety', riskLevel: (isStorm(w.conditionId) ? 'critical' : w.temperature > 36 ? 'high' : 'low') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Outdoor field crew exposed to all weather hazards.', icon: 'Users' },
    { area: 'Equipment Integrity', riskLevel: (w.rainAmount > 20 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Heavy rain may compromise insulation resistance testing results.', icon: 'Shield' },
  ];

  const actions = [];
  if (isStorm(w.conditionId)) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Safety', action: 'Ground all field crews immediately', rationale: 'Zero tolerance for field crew exposure during electrical storm' });
  if (w.windSpeed > 10) actions.push({ id: 'r2', priority: 'high' as const, category: 'Operations', action: 'Cancel all aerial lift and elevated work orders', rationale: 'Wind speed exceeds safe operating envelope for elevated platforms' });
  actions.push({ id: 'r3', priority: 'medium' as const, category: 'Scheduling', action: 'Re-schedule to next sub-7 m/s window', rationale: 'Forecast shows acceptable conditions tomorrow morning' });
  actions.push({ id: 'r4', priority: 'low' as const, category: 'Documentation', action: 'Log weather-hold in maintenance management system', rationale: 'Maintain regulatory compliance records' });

  const tRisks = [clamp(score * 0.6, 0, 100), clamp(score, 0, 100), clamp(score * 0.7, 0, 100), clamp(score * 0.3, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Utility maintenance operations face ${score > 60 ? 'critical safety constraints' : score > 30 ? 'elevated risk' : 'acceptable conditions'}. ${keyRisks[0] || 'Field conditions are within safe parameters.'}`,
    operationalRecommendation: score > 80 ? 'All field operations must cease immediately. Lightning and wind hazards are life-threatening on utility infrastructure.' : score > 60 ? 'Suspend all elevated and line work. Limit to indoor depot maintenance only.' : score > 30 ? 'Proceed with ground-level work only. Monitor wind and storm conditions continuously.' : 'Normal maintenance operations. Apply standard electrical safety isolation procedures.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}

// Emergency Response
export function analyzeEmergencyResponse(w: WeatherInput): ScenarioResult {
  let score = 0;
  const visRisk = w.visibility < 0.5 ? 30 : w.visibility < 1 ? 15 : 0;
  const windRisk = w.windSpeed > 20 ? 25 : w.windSpeed > 15 ? 15 : 0;
  const rainRisk = w.rainAmount > 30 ? 25 : 0;
  const stormRisk = isStorm(w.conditionId) ? 30 : 0;
  // Emergency response doesn't halt operations — it adapts. Score reflects operational complexity.
  score = clamp(visRisk + windRisk + rainRisk + stormRisk, 0, 80);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (w.visibility < 0.5) keyRisks.push(`Reduced visibility (${w.visibility.toFixed(1)} km) impacts aerial search operations`);
  if (w.windSpeed > 15) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s — helicopter and aerial unit operations restricted`);
  if (isStorm(w.conditionId)) keyRisks.push('Thunderstorm — aerial response units grounded, road units on standby');
  if (w.rainAmount > 20) keyRisks.push('Flash flood risk — road rescue routes may be impassable');
  positive.push('Emergency response operations continue regardless of weather');
  if (w.visibility > 3) positive.push('Visibility acceptable for aerial search and rescue');

  const alerts = [];
  if (isStorm(w.conditionId)) alerts.push({ id: 'a1', type: 'storm', severity: 'warning' as const, title: 'Aerial Units Grounded', description: 'Thunderstorm conditions prevent helicopter and drone deployment.', suggestedAction: 'Deploy ground-based rapid response teams. Coordinate with neighbouring jurisdictions for aerial backup.', icon: 'CloudLightning' });
  if (w.visibility < 1) alerts.push({ id: 'a2', type: 'visibility', severity: 'warning' as const, title: 'Reduced Visibility Operations', description: `Visibility at ${w.visibility.toFixed(1)} km. Aerial search pattern effectiveness significantly reduced.`, suggestedAction: 'Switch to thermal imaging. Increase ground team density in search zones.', icon: 'Eye' });
  if (w.rainAmount > 20) alerts.push({ id: 'a3', type: 'flood', severity: 'critical' as const, title: 'Flash Flood Risk', description: `Heavy rainfall of ${Math.round(w.rainAmount)}mm may trigger flash flooding.`, suggestedAction: 'Pre-position water rescue assets. Alert urban flood response teams.', icon: 'Waves' });

  const impacts = [
    { area: 'Aerial Operations', riskLevel: (isStorm(w.conditionId) || w.windSpeed > 15 ? 'critical' : w.visibility < 1 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Helicopter and drone unit availability.', icon: 'Radio' },
    { area: 'Ground Response', riskLevel: (w.rainAmount > 20 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Road conditions and flooding may impede ground unit access.', icon: 'Siren' },
    { area: 'Search Effectiveness', riskLevel: (w.visibility < 1 ? 'high' : w.cloudCover > 80 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Weather conditions reduce search pattern effectiveness.', icon: 'Search' },
    { area: 'Incident Volume', riskLevel: (isStorm(w.conditionId) || w.rainAmount > 20 ? 'high' : 'moderate') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Severe weather typically increases call volume by 40–80%.', icon: 'TrendingUp' },
  ];

  const actions = [];
  actions.push({ id: 'r1', priority: 'high' as const, category: 'Readiness', action: 'Move to elevated readiness level', rationale: 'Severe weather conditions increase incident probability significantly' });
  if (isStorm(w.conditionId)) actions.push({ id: 'r2', priority: 'high' as const, category: 'Assets', action: 'Pre-position water rescue teams in flood zones', rationale: 'Flash flood incidents expected with current rainfall' });
  actions.push({ id: 'r3', priority: 'medium' as const, category: 'Communications', action: 'Coordinate mutual aid agreements with neighbouring services', rationale: 'Weather event may require multi-agency response' });
  actions.push({ id: 'r4', priority: 'medium' as const, category: 'Personnel', action: 'Ensure all crew have weather-appropriate PPE', rationale: 'Field personnel exposed to extreme conditions throughout operations' });

  const tRisks = [clamp(score * 0.6, 0, 100), clamp(score, 0, 100), clamp(score * 0.9, 0, 100), clamp(score * 0.7, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Emergency response operations face ${score > 40 ? 'elevated operational complexity' : 'standard'} weather conditions. ${keyRisks[0] || 'Conditions allow full deployment of all response assets.'}`,
    operationalRecommendation: score > 60 ? 'Activate enhanced readiness protocol. Aerial units on standby. Ground rapid-response teams pre-positioned.' : score > 30 ? 'Move to elevated readiness. Issue weather advisory to all dispatch and field supervisors.' : 'Normal operational readiness. Maintain standard weather watch protocol.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}
