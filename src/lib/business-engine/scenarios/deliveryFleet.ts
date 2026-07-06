import { WeatherInput, ScenarioResult, clamp, isStorm, isRain, isSnow, isHazardousAtmosphere, buildTimeline, getOperationalStatus } from '../types';

export function analyzeDeliveryFleet(w: WeatherInput): ScenarioResult {
  let score = 0;
  const windRisk = w.windSpeed > 20 ? 30 : w.windSpeed > 15 ? 15 : w.windSpeed > 10 ? 5 : 0;
  const rainRisk = w.rainAmount > 30 ? 30 : w.rainAmount > 15 ? 18 : w.rainProbability > 70 ? 10 : 0;
  const snowRisk = isSnow(w.conditionId) ? 35 : 0;
  const fogRisk = isHazardousAtmosphere(w.conditionId) ? 25 : w.visibility < 0.5 ? 30 : w.visibility < 1 ? 15 : 0;
  const stormRisk = isStorm(w.conditionId) ? 40 : 0;
  const heatRisk = w.temperature > 40 ? 10 : 0;
  score = clamp(windRisk + rainRisk + snowRisk + fogRisk + stormRisk + heatRisk, 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isStorm(w.conditionId)) keyRisks.push('Active thunderstorm — flash flooding and zero visibility risk on roads');
  if (isSnow(w.conditionId)) keyRisks.push('Snowfall causing icy road surfaces — braking distances significantly increased');
  if (w.visibility < 0.5) keyRisks.push(`Visibility at ${w.visibility.toFixed(1)} km — below minimum safe driving threshold`);
  if (w.rainAmount > 15) keyRisks.push(`Heavy rainfall of ${Math.round(w.rainAmount)}mm — aquaplaning risk on highways`);
  if (w.windSpeed > 15) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s — high-sided vehicle stability risk`);
  if (!isStorm(w.conditionId) && !isSnow(w.conditionId)) positive.push('No extreme precipitation events active');
  if (w.visibility > 5) positive.push('Good visibility conditions for road transport');
  if (w.windSpeed < 10) positive.push('Wind within safe operating limits for heavy vehicles');

  const alerts = [];
  if (isStorm(w.conditionId)) alerts.push({ id: 'a1', type: 'storm', severity: 'critical' as const, title: 'Severe Storm Warning', description: 'Active thunderstorm creates flash flood and zero-visibility risk.', suggestedAction: 'Hold all dispatches until storm clears. Recall vehicles already on route to safe locations.', icon: 'CloudLightning' });
  if (isSnow(w.conditionId) || w.snowAmount > 0) alerts.push({ id: 'a2', type: 'snow', severity: 'critical' as const, title: 'Snow & Ice Road Alert', description: 'Snow conditions causing dangerous road surfaces across the route network.', suggestedAction: 'Fit snow chains. Reduce speed limits by 30%. Re-route away from elevated roads.', icon: 'Snowflake' });
  if (w.visibility < 1) alerts.push({ id: 'a3', type: 'fog', severity: 'warning' as const, title: 'Dense Fog Advisory', description: `Visibility reduced to ${w.visibility.toFixed(1)} km.`, suggestedAction: 'Activate fog lights. Increase following distance. Limit speed to 50 km/h on open roads.', icon: 'Wind' });

  const impacts = [
    { area: 'Vehicle Safety', riskLevel: (isStorm(w.conditionId) || isSnow(w.conditionId) ? 'critical' : w.rainAmount > 15 ? 'high' : 'low') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Road surface conditions affected by ${w.condition} weather.`, icon: 'Truck' },
    { area: 'Driver Visibility', riskLevel: (w.visibility < 0.5 ? 'critical' : w.visibility < 2 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Current visibility ${w.visibility.toFixed(1)} km.`, icon: 'Eye' },
    { area: 'On-Time Performance', riskLevel: (score > 60 ? 'high' : score > 30 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Weather conditions will increase transit times and may cause route deviations.', icon: 'Clock' },
    { area: 'Cargo Integrity', riskLevel: (w.rainAmount > 20 ? 'high' : w.rainProbability > 50 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Rain probability of ${Math.round(w.rainProbability)}% risks moisture damage to exposed cargo.`, icon: 'Package' },
  ];

  const actions = [];
  if (score > 60) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Dispatch', action: 'Suspend non-critical dispatches', rationale: 'Weather conditions present unacceptable road risk' });
  if (isSnow(w.conditionId)) actions.push({ id: 'r2', priority: 'urgent' as const, category: 'Fleet', action: 'Verify all vehicles have snow chains fitted', rationale: 'Mandatory for safe traction on icy surfaces' });
  actions.push({ id: 'r3', priority: 'high' as const, category: 'Operations', action: 'Issue weather advisory to all drivers', rationale: 'Ensure drivers are aware of current hazards and adjusted protocols' });
  if (w.rainAmount > 15) actions.push({ id: 'r4', priority: 'medium' as const, category: 'Cargo', action: 'Secure all cargo with waterproof covers', rationale: `${Math.round(w.rainAmount)}mm rain forecast — all exposed cargo at risk` });
  actions.push({ id: 'r5', priority: 'low' as const, category: 'Planning', action: 'Pre-check all routes for flood-prone sections', rationale: 'Identify alternative routes before dispatch' });

  const tRisks = [clamp(score * 0.6, 0, 100), clamp(score, 0, 100), clamp(score * 0.9, 0, 100), clamp(score * 0.7, 0, 100)];

  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Fleet dispatch operations face ${score > 60 ? 'significant' : score > 30 ? 'moderate' : 'acceptable'} weather risk. ${keyRisks[0] || 'Road conditions are within normal parameters.'}`,
    operationalRecommendation: score > 80 ? 'Halt all fleet dispatches. Recall vehicles to depot. Do not resume until storm clearance confirmed.' : score > 60 ? 'Suspend non-essential routes. Operate emergency deliveries only with enhanced protocols.' : score > 30 ? 'Proceed with caution. Issue advisory to drivers and monitor route conditions continuously.' : 'Fleet operations can proceed normally. Maintain standard safety protocols.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}
