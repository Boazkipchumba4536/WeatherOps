import { WeatherInput, ScenarioResult, clamp, isStorm, isSnow, isHazardousAtmosphere, buildTimeline, getOperationalStatus } from '../types';

// Motorcycle Delivery — most vulnerable road users
export function analyzeMotorcycleDelivery(w: WeatherInput): ScenarioResult {
  let score = 0;
  const rainRisk = isStorm(w.conditionId) ? 60 : w.rainAmount > 10 ? 45 : w.rainProbability > 70 ? 35 : w.rainProbability > 40 ? 15 : 0;
  const windRisk = w.windSpeed > 10 ? 40 : w.windSpeed > 7 ? 20 : w.windSpeed > 5 ? 8 : 0;
  const snowRisk = isSnow(w.conditionId) ? 70 : 0;
  const fogRisk = isHazardousAtmosphere(w.conditionId) ? 35 : w.visibility < 0.5 ? 40 : w.visibility < 1 ? 20 : 0;
  const heatRisk = w.temperature > 38 ? 15 : 0;
  score = clamp(rainRisk + windRisk + snowRisk + fogRisk + heatRisk, 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isSnow(w.conditionId)) keyRisks.push('Snow and ice conditions — motorcycles are at extreme fall risk on all road surfaces');
  if (isStorm(w.conditionId)) keyRisks.push('Active thunderstorm creates zero-visibility and lightning risk for exposed riders');
  if (w.rainProbability > 70) keyRisks.push(`High rain probability (${Math.round(w.rainProbability)}%) — wet roads significantly increase motorcycle stopping distances`);
  if (w.windSpeed > 7) keyRisks.push(`Crosswinds at ${Math.round(w.windSpeed)} m/s create lane stability risk at highway speeds`);
  if (w.visibility < 1) keyRisks.push(`Visibility at ${w.visibility.toFixed(1)} km — riders are at extreme risk from other road users`);
  if (!isSnow(w.conditionId) && !isStorm(w.conditionId)) positive.push('No extreme precipitation events — roads are passable');
  if (w.windSpeed < 5) positive.push('Light wind — stable riding conditions');
  if (w.visibility > 5) positive.push('Good visibility — safe for urban and highway riding');

  const alerts = [];
  if (isSnow(w.conditionId)) alerts.push({ id: 'a1', type: 'snow', severity: 'critical' as const, title: 'Operations Must Halt — Ice Risk', description: 'Snowfall creates ice-covered road surfaces. Motorcycles cannot be safely operated.', suggestedAction: 'Ground all motorcycle couriers. Switch to cage vehicle delivery or notify customers of delays.', icon: 'Snowflake' });
  if (w.rainProbability > 60) alerts.push({ id: 'a2', type: 'rain', severity: 'warning' as const, title: 'Wet Road Advisory', description: 'Rain conditions significantly increase motorcycle fall risk.', suggestedAction: 'Issue all riders with wet-weather advisory. Reduce speed targets by 20%. Increase spacing between dispatches.', icon: 'CloudRain' });
  if (w.windSpeed > 7) alerts.push({ id: 'a3', type: 'wind', severity: 'warning' as const, title: 'Crosswind Risk for Riders', description: `Wind at ${Math.round(w.windSpeed)} m/s creates significant lateral stability risk, especially on exposed routes.`, suggestedAction: 'Avoid routing through open highway or exposed bridge sections. Reduce open-road speed.', icon: 'Wind' });

  const impacts = [
    { area: 'Rider Safety', riskLevel: (score > 60 ? 'critical' : score > 30 ? 'high' : 'low') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Motorcycle riders are directly exposed to weather. Current risk: ${score}%.`, icon: 'Shield' },
    { area: 'Delivery Performance', riskLevel: (score > 50 ? 'high' : score > 25 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Adverse weather increases delivery times and incident probability.', icon: 'Clock' },
    { area: 'Order Volume Handling', riskLevel: (score > 60 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Reduced active riders will impact delivery SLA commitments.', icon: 'Package' },
    { area: 'Customer Communication', riskLevel: (score > 60 ? 'high' : 'moderate') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Weather-related delays require proactive customer communication.', icon: 'MessageSquare' },
  ];

  const actions = [];
  if (isSnow(w.conditionId)) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Safety', action: 'Ground all motorcycle riders immediately', rationale: 'Icy surfaces make two-wheeled operation life-threatening' });
  if (w.rainProbability > 60) actions.push({ id: 'r2', priority: 'high' as const, category: 'Equipment', action: 'Mandate waterproof gear for all active riders', rationale: 'Core body temperature maintenance critical for safe riding' });
  if (w.windSpeed > 7) actions.push({ id: 'r3', priority: 'high' as const, category: 'Routing', action: 'Exclude exposed motorway and bridge routes', rationale: 'High crosswind risk on open sections' });
  actions.push({ id: 'r4', priority: 'medium' as const, category: 'Customer', action: 'Update estimated delivery times by +20 min', rationale: 'Weather will slow all riders — proactively manage expectations' });
  actions.push({ id: 'r5', priority: 'low' as const, category: 'Planning', action: 'Identify cage-vehicle backup capacity', rationale: 'Prepare to switch to car couriers if conditions deteriorate' });

  const tRisks = [clamp(score * 0.5, 0, 100), clamp(score, 0, 100), clamp(score * 0.9, 0, 100), clamp(score * 0.3, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Motorcycle delivery operations present ${score > 60 ? 'unacceptable' : score > 30 ? 'elevated' : 'manageable'} rider risk under current conditions. ${keyRisks[0] || 'Road conditions are within safe operating parameters.'}`,
    operationalRecommendation: score > 80 ? 'Halt all motorcycle deliveries. Riders must not operate in current conditions. Activate vehicle backup plan.' : score > 60 ? 'Significantly reduce rider deployment. Prioritise safety over delivery SLAs.' : score > 30 ? 'Proceed with enhanced rider safety protocols. Monitor conditions every 30 minutes.' : 'Normal operations. Apply standard rider welfare checks.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}

// Road Transport (long-haul trucking)
export function analyzeRoadTransport(w: WeatherInput): ScenarioResult {
  let score = 0;
  const rainRisk = isStorm(w.conditionId) ? 45 : w.rainAmount > 30 ? 25 : w.rainProbability > 70 ? 15 : 0;
  const windRisk = w.windSpeed > 20 ? 40 : w.windSpeed > 15 ? 25 : w.windSpeed > 10 ? 10 : 0;
  const snowRisk = isSnow(w.conditionId) ? 40 : 0;
  const fogRisk = w.visibility < 0.1 ? 45 : w.visibility < 0.5 ? 30 : w.visibility < 1 ? 15 : 0;
  const stormRisk = isStorm(w.conditionId) ? 20 : 0;
  score = clamp(rainRisk + windRisk + snowRisk + fogRisk + stormRisk, 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (w.windSpeed > 15) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s — high-sided vehicles at tip-over risk on exposed roads`);
  if (isSnow(w.conditionId)) keyRisks.push('Snow and ice conditions — extended stopping distances for heavy vehicles');
  if (w.visibility < 0.5) keyRisks.push(`Visibility at ${w.visibility.toFixed(1)} km — mandatory speed reduction per highway code`);
  if (w.rainAmount > 20) keyRisks.push(`${Math.round(w.rainAmount)}mm rain — aquaplaning risk for heavy vehicles at motorway speeds`);
  if (w.windSpeed < 10) positive.push('Wind within safe limits for high-sided vehicle operation');
  if (!isSnow(w.conditionId)) positive.push('No snow/ice conditions on road network');

  const alerts = [];
  if (w.windSpeed > 15) alerts.push({ id: 'a1', type: 'wind', severity: 'critical' as const, title: 'High Wind — Vehicle Tip Risk', description: `Sustained ${Math.round(w.windSpeed)} m/s wind creates tip-over risk for high-sided and empty vehicles.`, suggestedAction: 'Avoid exposed sections of motorway and bridges. Reduce speed to 50 km/h in open sections.', icon: 'Wind' });
  if (w.visibility < 0.5) alerts.push({ id: 'a2', type: 'fog', severity: 'critical' as const, title: 'Dense Fog — Hazard Warning', description: `Visibility reduced to ${w.visibility.toFixed(1)} km. Heavy vehicles require significantly greater stopping distances.`, suggestedAction: 'Activate mandatory fog light protocol. Reduce speed to 40 km/h. Pull off if visibility drops below 50m.', icon: 'CloudFog' });
  if (isSnow(w.conditionId)) alerts.push({ id: 'a3', type: 'snow', severity: 'critical' as const, title: 'Snow & Ice — Road Closure Risk', description: 'Snow conditions may cause road closures and significantly impact route availability.', suggestedAction: 'Fit snow chains. Check route status with highway authority. Carry emergency provisions.', icon: 'Snowflake' });

  const impacts = [
    { area: 'Driver Safety', riskLevel: (score > 60 ? 'critical' : score > 30 ? 'high' : 'low') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Weather conditions directly impact driver and road user safety.', icon: 'Shield' },
    { area: 'Transit Time', riskLevel: (score > 50 ? 'high' : score > 20 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Reduced speed limits and road conditions will delay all journeys.', icon: 'Clock' },
    { area: 'Fuel Efficiency', riskLevel: (w.windSpeed > 10 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Headwinds and weather-adjusted speeds will increase fuel consumption.', icon: 'Fuel' },
    { area: 'Cargo Security', riskLevel: (w.windSpeed > 15 || w.rainAmount > 20 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Wind and rain present risk to unsecured or improperly sheeted loads.', icon: 'Package' },
  ];

  const actions = [];
  if (w.windSpeed > 15) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Safety', action: 'Divert all routes away from exposed sections', rationale: 'High-sided vehicle stability at critical risk on motorway and bridge sections' });
  actions.push({ id: 'r2', priority: 'high' as const, category: 'Driver', action: 'Issue journey-specific weather briefing to all drivers', rationale: 'Ensure all drivers aware of hazardous sections and required precautions' });
  if (w.rainAmount > 10) actions.push({ id: 'r3', priority: 'medium' as const, category: 'Cargo', action: 'Inspect and tighten all load restraints and sheeting', rationale: 'Rain and wind may loosen cargo securing equipment' });
  actions.push({ id: 'r4', priority: 'low' as const, category: 'Planning', action: 'Pre-book overnight stops on extended routes', rationale: 'Drivers may need to stop if conditions deteriorate mid-journey' });

  const tRisks = [clamp(score * 0.6, 0, 100), clamp(score, 0, 100), clamp(score * 0.8, 0, 100), clamp(score * 0.5, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Road transport operations face ${score > 60 ? 'significant' : score > 30 ? 'moderate' : 'low'} weather risk. ${keyRisks[0] || 'Route conditions are within acceptable parameters for heavy vehicle operation.'}`,
    operationalRecommendation: score > 80 ? 'Halt all long-haul dispatches. Current conditions present unacceptable safety risk for HGV operations.' : score > 60 ? 'Non-essential transport should be suspended. Emergency loads proceed with enhanced precautions.' : score > 30 ? 'Proceed with caution. Apply speed restrictions and issue driver weather advisory.' : 'Normal transport operations. Maintain standard driving protocols.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}
