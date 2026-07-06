import { WeatherInput, ScenarioResult, clamp, isStorm, isRain, isSnow, buildTimeline, getOperationalStatus } from '../types';

// School Activities
export function analyzeSchoolActivities(w: WeatherInput): ScenarioResult {
  let score = 0;
  const stormRisk = isStorm(w.conditionId) ? 80 : 0;
  const rainRisk = w.rainAmount > 15 ? 35 : w.rainProbability > 70 ? 20 : w.rainProbability > 40 ? 10 : 0;
  const heatRisk = w.temperature > 35 ? 35 : w.temperature > 30 ? 15 : 0;
  const coldRisk = w.temperature < 0 ? 25 : w.temperature < 5 ? 10 : 0;
  const windRisk = w.windSpeed > 12 ? 15 : 0;
  const uvRisk = w.uvIndex > 8 ? 15 : w.uvIndex > 6 ? 7 : 0;
  score = clamp(Math.max(stormRisk, rainRisk + heatRisk + coldRisk + windRisk + uvRisk), 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isStorm(w.conditionId)) keyRisks.push('Active thunderstorm — immediate cessation of all outdoor activities required');
  if (w.temperature > 35) keyRisks.push(`Temperature ${Math.round(w.temperature)}°C — heat stress risk for children during outdoor activities`);
  if (w.rainAmount > 15) keyRisks.push(`Heavy rain (${Math.round(w.rainAmount)}mm) — outdoor events and sports cancelled`);
  if (w.uvIndex > 8) keyRisks.push(`UV Index ${Math.round(w.uvIndex)} — sun protection mandatory for all outdoor activities`);
  if (!isStorm(w.conditionId) && w.rainProbability < 30) positive.push('Low precipitation risk — suitable for outdoor activities');
  if (w.temperature >= 12 && w.temperature <= 28) positive.push('Comfortable temperature range for children\'s outdoor activities');
  if (w.uvIndex < 5) positive.push('UV levels acceptable — standard sun awareness measures sufficient');

  const alerts = [];
  if (isStorm(w.conditionId)) alerts.push({ id: 'a1', type: 'storm', severity: 'critical' as const, title: 'All Outdoor Activities Must Cease', description: 'Thunderstorm creates lightning hazard for children and staff in open areas.', suggestedAction: 'Move all students indoors immediately. Cancel all field trips. Do not resume until 30 minutes after last lightning.', icon: 'CloudLightning' });
  if (w.temperature > 32) alerts.push({ id: 'a2', type: 'heat', severity: 'warning' as const, title: 'Child Heat Safety Alert', description: `Temperature of ${Math.round(w.temperature)}°C with heat index ${Math.round(w.feelsLike)}°C exceeds safe outdoor activity threshold for children.`, suggestedAction: 'Cancel all non-essential outdoor activities. If outdoor events proceed, mandate shade and 15-min water breaks.', icon: 'Thermometer' });
  if (w.uvIndex > 7) alerts.push({ id: 'a3', type: 'uv', severity: 'warning' as const, title: 'High UV Alert', description: `UV Index of ${Math.round(w.uvIndex)} — unprotected skin damage risk within 15 minutes.`, suggestedAction: 'Mandate SPF50+ sunscreen application before outdoor activities. Enforce hat policy.', icon: 'Sun' });

  const impacts = [
    { area: 'Outdoor Sports', riskLevel: (isStorm(w.conditionId) || w.rainAmount > 10 ? 'critical' : w.temperature > 32 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Weather conditions directly affect physical education and sports day viability.', icon: 'Trophy' },
    { area: 'Field Trips', riskLevel: (isStorm(w.conditionId) || w.rainProbability > 60 ? 'high' : w.temperature > 30 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Off-site educational activities require stable weather conditions.', icon: 'MapPin' },
    { area: 'Child Welfare', riskLevel: (w.temperature > 33 || w.uvIndex > 8 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Children are more vulnerable to heat, UV, and cold than adults.', icon: 'Heart' },
    { area: 'Parental Communication', riskLevel: (score > 40 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Weather-related changes to the school day require parent notification.', icon: 'MessageSquare' },
  ];

  const actions = [];
  if (isStorm(w.conditionId)) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Safety', action: 'Activate indoor safety protocol', rationale: 'Children must be evacuated from all outdoor areas' });
  if (w.temperature > 30) actions.push({ id: 'r2', priority: 'high' as const, category: 'Welfare', action: 'Distribute water and enforce shade during all outdoor periods', rationale: 'Child thermoregulation is less effective than adults' });
  if (w.uvIndex > 6) actions.push({ id: 'r3', priority: 'high' as const, category: 'Protection', action: 'Enforce hat and sunscreen policy', rationale: `UV${Math.round(w.uvIndex)} can cause skin damage within 20 minutes` });
  if (w.rainProbability > 60) actions.push({ id: 'r4', priority: 'medium' as const, category: 'Planning', action: 'Prepare indoor alternative programmes', rationale: 'Have fallback indoor activities ready for spontaneous weather changes' });
  actions.push({ id: 'r5', priority: 'low' as const, category: 'Communication', action: 'Send weather advisory to parents', rationale: 'Advise on appropriate clothing and any activity changes' });

  const tRisks = [clamp(score * 0.4, 0, 100), clamp(score, 0, 100), clamp(score * 0.9, 0, 100), clamp(score * 0.2, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `School outdoor activities are ${score > 60 ? 'not safe' : score > 30 ? 'restricted' : 'viable'} under current conditions. ${keyRisks[0] || 'Weather conditions are suitable for planned outdoor activities.'}`,
    operationalRecommendation: score > 80 ? 'Cancel all outdoor activities. Move operations indoors. Issue parent communication immediately.' : score > 60 ? 'Outdoor sports and field trips should be cancelled. Brief indoor alternatives required.' : score > 30 ? 'Outdoor activities proceed with welfare adaptations. Monitor heat, UV, and rain closely.' : 'All activities can proceed normally. Apply standard outdoor safety protocols.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}

// Tourism & Visitor Experiences
export function analyzeTourism(w: WeatherInput): ScenarioResult {
  let score = 0;
  const rainRisk = isStorm(w.conditionId) ? 50 : w.rainAmount > 15 ? 30 : w.rainProbability > 70 ? 20 : w.rainProbability > 40 ? 10 : 0;
  const windRisk = w.windSpeed > 15 ? 20 : w.windSpeed > 10 ? 10 : 0;
  const heatRisk = w.temperature > 38 ? 20 : w.temperature > 35 ? 10 : 0;
  const coldRisk = w.temperature < 0 ? 15 : w.temperature < 5 ? 7 : 0;
  const visRisk = w.visibility < 2 ? 25 : w.visibility < 5 ? 10 : 0;
  score = clamp(rainRisk + windRisk + heatRisk + coldRisk + visRisk, 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isStorm(w.conditionId)) keyRisks.push('Thunderstorm — outdoor tours must be cancelled for visitor safety');
  if (w.rainAmount > 15) keyRisks.push(`Heavy rain (${Math.round(w.rainAmount)}mm) — most outdoor attractions become unsafe or unattractive`);
  if (w.temperature > 36) keyRisks.push(`Extreme heat (${Math.round(w.temperature)}°C) — tourist heat stress risk, especially elderly visitors`);
  if (w.visibility < 2) keyRisks.push(`Poor visibility (${w.visibility.toFixed(1)} km) — scenic and landscape tours lose key value proposition`);
  if (!isStorm(w.conditionId) && w.rainProbability < 20) positive.push('Good conditions for outdoor tours and activities');
  if (w.visibility > 10) positive.push('Excellent visibility — ideal for scenic and landscape experiences');
  if (w.temperature >= 18 && w.temperature <= 28) positive.push('Ideal temperature for comfortable visitor experience');

  const alerts = [];
  if (isStorm(w.conditionId)) alerts.push({ id: 'a1', type: 'storm', severity: 'critical' as const, title: 'Cancel Outdoor Tour Operations', description: 'Thunderstorm poses life-safety risk to all outdoor visitors and tour groups.', suggestedAction: 'Evacuate all outdoor attractions. Offer full refunds or indoor alternatives. Issue guest safety advisory.', icon: 'CloudLightning' });
  if (w.temperature > 35) alerts.push({ id: 'a2', type: 'heat', severity: 'warning' as const, title: 'Visitor Heat Advisory', description: `Temperature of ${Math.round(w.temperature)}°C poses health risk, especially to elderly, children, and foreign tourists.`, suggestedAction: 'Deploy water stations throughout venue. Brief guides on heat emergency protocol. Schedule outdoor tours in early morning or late afternoon.', icon: 'Thermometer' });

  const impacts = [
    { area: 'Outdoor Experiences', riskLevel: (isStorm(w.conditionId) ? 'critical' : w.rainProbability > 60 ? 'high' : score > 30 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `${score > 50 ? 'Weather conditions will significantly deter or prevent outdoor tourism.' : 'Outdoor experiences viable with weather adaptations.'}`, icon: 'MapPin' },
    { area: 'Visitor Experience Quality', riskLevel: (w.visibility < 5 || w.rainProbability > 50 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Visibility of ${w.visibility.toFixed(1)} km and ${Math.round(w.rainProbability)}% rain probability affect experience quality.`, icon: 'Star' },
    { area: 'Revenue Impact', riskLevel: (score > 60 ? 'high' : score > 30 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Cancellations and reduced footfall driven by weather conditions.', icon: 'TrendingDown' },
    { area: 'Transport & Transfers', riskLevel: (w.windSpeed > 12 || w.rainAmount > 10 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Transfer vehicles and boat tours may be affected.', icon: 'Bus' },
  ];

  const actions = [];
  if (score > 60) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Operations', action: 'Activate indoor/alternative tour programme', rationale: 'Outdoor activities are unviable — provide paid indoor alternatives to maintain revenue' });
  if (w.temperature > 32) actions.push({ id: 'r2', priority: 'high' as const, category: 'Visitor Welfare', action: 'Deploy mobile water and shade stations', rationale: 'Visitor welfare and duty of care obligations in high heat' });
  if (w.rainProbability > 50) actions.push({ id: 'r3', priority: 'medium' as const, category: 'Logistics', action: 'Pre-position umbrellas and ponchos at entry points', rationale: 'Improve visitor experience and reduce complaints' });
  actions.push({ id: 'r4', priority: 'low' as const, category: 'Communication', action: 'Update tour listings with weather advisory', rationale: 'Set accurate visitor expectations before arrival' });

  const tRisks = [clamp(score * 0.4, 0, 100), clamp(score, 0, 100), clamp(score * 0.85, 0, 100), clamp(score * 0.2, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Tourism operations face ${score > 60 ? 'significant disruption' : score > 30 ? 'moderate challenges' : 'favorable conditions'}. ${keyRisks[0] || 'Weather conditions are ideal for visitor experiences.'}`,
    operationalRecommendation: score > 70 ? 'Suspend outdoor operations. Activate full indoor programme. Issue guest refund/rebooking communication.' : score > 40 ? 'Adapt outdoor programmes. Offer flexibility and indoor alternatives. Brief all guides on weather protocol.' : 'Operations proceed as planned. Deploy standard guest experience protocols.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}

// Public Transport
export function analyzePublicTransport(w: WeatherInput): ScenarioResult {
  let score = 0;
  const snowRisk = isSnow(w.conditionId) ? 55 : 0;
  const stormRisk = isStorm(w.conditionId) ? 35 : 0;
  const fogRisk = w.visibility < 0.5 ? 30 : w.visibility < 1 ? 15 : 0;
  const rainRisk = w.rainAmount > 30 ? 20 : w.rainProbability > 70 ? 10 : 0;
  const windRisk = w.windSpeed > 20 ? 25 : w.windSpeed > 15 ? 10 : 0;
  score = clamp(snowRisk + stormRisk + fogRisk + rainRisk + windRisk, 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isSnow(w.conditionId)) keyRisks.push('Snowfall causing severe delays across bus and tram networks');
  if (w.visibility < 0.5) keyRisks.push(`Visibility ${w.visibility.toFixed(1)} km — service speed restrictions in effect`);
  if (w.windSpeed > 15) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s — overhead line fault risk for trams and light rail`);
  if (isStorm(w.conditionId)) keyRisks.push('Thunderstorm causing infrastructure disruption on exposed routes');
  if (!isSnow(w.conditionId)) positive.push('No snow/ice affecting road network');
  if (w.visibility > 5) positive.push('Visibility permits normal service operations');

  const alerts = [];
  if (isSnow(w.conditionId)) alerts.push({ id: 'a1', type: 'snow', severity: 'critical' as const, title: 'Network Disruption — Snow', description: 'Snowfall causing widespread delays and service cancellations.', suggestedAction: 'Activate snow plan. Increase service headways. Deploy passenger information updates via all channels.', icon: 'Snowflake' });
  if (w.windSpeed > 15) alerts.push({ id: 'a2', type: 'wind', severity: 'warning' as const, title: 'Overhead Line Fault Risk', description: 'High winds may cause overhead line damage on tram and rail routes.', suggestedAction: 'Deploy lineside inspection teams. Prepare bus replacement service contingency.', icon: 'Wind' });

  const impacts = [
    { area: 'Service Reliability', riskLevel: (score > 60 ? 'critical' : score > 30 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'On-time performance directly impacted by weather conditions.', icon: 'Clock' },
    { area: 'Passenger Safety', riskLevel: (isSnow(w.conditionId) || w.windSpeed > 15 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Icy platforms, stops, and road surfaces create passenger slip risk.', icon: 'Users' },
    { area: 'Infrastructure', riskLevel: (w.windSpeed > 15 || isStorm(w.conditionId) ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Overhead lines, signals, and depots at risk in severe weather.', icon: 'Zap' },
    { area: 'Demand Surge', riskLevel: (score > 40 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Adverse weather increases passenger demand for public transport.', icon: 'TrendingUp' },
  ];

  const actions = [];
  if (isSnow(w.conditionId)) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Operations', action: 'Activate snow contingency plan', rationale: 'Implement pre-approved service reduction and alternative routing' });
  if (score > 40) actions.push({ id: 'r2', priority: 'high' as const, category: 'Passenger', action: 'Push real-time service alerts to all channels', rationale: 'Inform passengers of delays before they leave for their stop' });
  actions.push({ id: 'r3', priority: 'medium' as const, category: 'Infrastructure', action: 'Station anti-slip treatment teams at all major stops', rationale: 'Reduce passenger fall incidents in wet and icy conditions' });
  actions.push({ id: 'r4', priority: 'low' as const, category: 'Staffing', action: 'Brief all platform and driver staff on weather protocol', rationale: 'Consistent passenger communication during disruption' });

  const tRisks = [clamp(score * 0.6, 0, 100), clamp(score, 0, 100), clamp(score * 0.9, 0, 100), clamp(score * 0.5, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Public transport network faces ${score > 60 ? 'significant disruption' : score > 30 ? 'service delays' : 'normal operations'} under current conditions. ${keyRisks[0] || 'Network conditions are within normal parameters.'}`,
    operationalRecommendation: score > 70 ? 'Activate full weather contingency plan. Significant network disruption imminent. Communicate proactively.' : score > 40 ? 'Issue service advisory. Deploy additional staff at key interchanges. Monitor conditions closely.' : 'Normal service operations. Maintain standard passenger safety protocols.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}

// Marine Operations
export function analyzeMarineOperations(w: WeatherInput): ScenarioResult {
  let score = 0;
  const windRisk = w.windSpeed > 20 ? 55 : w.windSpeed > 15 ? 35 : w.windSpeed > 10 ? 15 : 0;
  const stormRisk = isStorm(w.conditionId) ? 60 : 0;
  const visRisk = w.visibility < 0.5 ? 40 : w.visibility < 2 ? 20 : 0;
  const rainRisk = w.rainAmount > 20 ? 10 : 0;
  score = clamp(Math.max(stormRisk, windRisk + visRisk + rainRisk), 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isStorm(w.conditionId)) keyRisks.push('Severe storm — all vessel operations in open water must cease');
  if (w.windSpeed > 15) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s (Beaufort scale) — dangerous sea states expected`);
  if (w.visibility < 2) keyRisks.push(`Visibility at ${w.visibility.toFixed(1)} km — COLREGS Rule 19 speed restriction in effect`);
  if (w.windSpeed < 7) positive.push('Wind speed within safe small vessel operating range');
  if (w.visibility > 5) positive.push('Good visibility — COLREGS clear-visibility rules apply');

  const alerts = [];
  if (isStorm(w.conditionId)) alerts.push({ id: 'a1', type: 'storm', severity: 'critical' as const, title: 'All Vessels Return to Port', description: 'Severe storm conditions create life-threatening sea states. No vessel class should remain in open water.', suggestedAction: 'Issue immediate return-to-port order. Activate port emergency services. Cancel all scheduled departures.', icon: 'Anchor' });
  if (w.windSpeed > 15) alerts.push({ id: 'a2', type: 'wind', severity: w.windSpeed > 20 ? 'critical' as const : 'warning' as const, title: 'Dangerous Sea State Warning', description: `${Math.round(w.windSpeed)} m/s wind generating wave heights exceeding safe operating limits.`, suggestedAction: 'Ground all vessels under 30m LOA. Restrict operations to harbour approach and sheltered areas.', icon: 'Waves' });
  if (w.visibility < 0.5) alerts.push({ id: 'a3', type: 'fog', severity: 'critical' as const, title: 'Navigation Hazard — Dense Fog', description: `Visibility at ${w.visibility.toFixed(1)} km. Collision risk is elevated for all vessels in congested waters.`, suggestedAction: 'Navigate at safe speed per COLREGS Rule 19. Activate radar watch. Sound fog signal every 2 minutes.', icon: 'CloudFog' });

  const impacts = [
    { area: 'Vessel Operations', riskLevel: (isStorm(w.conditionId) || w.windSpeed > 20 ? 'critical' : w.windSpeed > 12 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Sea state generated by ${Math.round(w.windSpeed)} m/s wind restricts vessel operations.`, icon: 'Anchor' },
    { area: 'Port Operations', riskLevel: (w.windSpeed > 15 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'High winds affect mooring operations, crane lifting, and vehicle access to quayside.', icon: 'Container' },
    { area: 'Navigation Safety', riskLevel: (w.visibility < 2 ? 'critical' : w.visibility < 5 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Visibility of ${w.visibility.toFixed(1)} km requires restricted speed navigation.`, icon: 'Compass' },
    { area: 'Crew Safety', riskLevel: (score > 60 ? 'critical' : score > 30 ? 'high' : 'low') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Sea conditions directly affect crew safety on deck and in small craft.', icon: 'Shield' },
  ];

  const actions = [];
  if (score > 60) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Safety', action: 'Issue all-vessel return-to-port order', rationale: 'Conditions exceed safe operating limits for all vessel classes' });
  if (w.windSpeed > 12) actions.push({ id: 'r2', priority: 'high' as const, category: 'Operations', action: 'Cancel all scheduled port departures', rationale: 'Sea state prohibits safe departure and arrival operations' });
  actions.push({ id: 'r3', priority: 'medium' as const, category: 'Navigation', action: 'Activate enhanced radar and radio watch', rationale: 'Reduced visibility requires all electronic navigation aids to be manned' });
  actions.push({ id: 'r4', priority: 'low' as const, category: 'Planning', action: 'Notify cargo and passenger stakeholders of delays', rationale: 'Proactively manage schedule expectations' });

  const tRisks = [clamp(score * 0.7, 0, 100), clamp(score, 0, 100), clamp(score * 0.85, 0, 100), clamp(score * 0.6, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Marine operations face ${score > 60 ? 'dangerous' : score > 30 ? 'challenging' : 'favourable'} sea conditions. ${keyRisks[0] || 'Sea state is within safe operating limits for normal vessel operations.'}`,
    operationalRecommendation: score > 80 ? 'All marine operations must cease. Return all vessels to port immediately. Do not resume until sea state is confirmed safe.' : score > 60 ? 'Suspend open-water operations. Restrict to sheltered harbour areas only.' : score > 30 ? 'Proceed with caution. Apply enhanced navigation watch. Brief all crew on current sea state.' : 'Normal marine operations. Apply standard maritime safety protocols.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}
