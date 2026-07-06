import { WeatherInput, ScenarioResult, clamp, isStorm, isRain, buildTimeline, getOperationalStatus } from '../types';

export function analyzeOutdoorEvent(w: WeatherInput): ScenarioResult {
  let score = 0;
  const rainRisk = isStorm(w.conditionId) ? 50 : w.rainAmount > 20 ? 40 : w.rainProbability > 80 ? 30 : w.rainProbability > 50 ? 15 : 0;
  const windRisk = w.windSpeed > 15 ? 35 : w.windSpeed > 10 ? 20 : w.windSpeed > 7 ? 8 : 0;
  const heatRisk = w.temperature > 38 ? 30 : w.temperature > 33 ? 15 : 0;
  const uvRisk = w.uvIndex > 10 ? 20 : w.uvIndex > 8 ? 10 : 0;
  const coldRisk = w.temperature < 5 ? 15 : 0;
  score = clamp(rainRisk + windRisk + heatRisk + uvRisk + coldRisk, 0, 100);
  const status = getOperationalStatus(score);
  const keyRisks: string[] = [];
  const positive: string[] = [];
  if (isStorm(w.conditionId)) keyRisks.push('Thunderstorm — immediate public evacuation required for all outdoor venues');
  if (w.rainAmount > 10) keyRisks.push(`Heavy rain (${Math.round(w.rainAmount)}mm) — crowd comfort and infrastructure at risk`);
  if (w.windSpeed > 10) keyRisks.push(`Wind at ${Math.round(w.windSpeed)} m/s — staging and temporary structures at risk of collapse`);
  if (w.temperature > 33) keyRisks.push(`Heat index ${Math.round(w.feelsLike)}°C — public health risk for large crowd gatherings`);
  if (w.uvIndex > 8) keyRisks.push(`UV Index ${Math.round(w.uvIndex)} — inadequate shade infrastructure a safety concern`);
  if (!isStorm(w.conditionId)) positive.push('No severe weather systems detected');
  if (w.rainProbability < 20) positive.push('Precipitation probability within acceptable range');
  if (w.windSpeed < 7) positive.push('Calm wind conditions — safe for staging and temporary structures');

  const alerts = [];
  if (isStorm(w.conditionId)) alerts.push({ id: 'a1', type: 'storm', severity: 'critical' as const, title: 'Immediate Venue Evacuation Required', description: 'Thunderstorm activity poses life-threatening risk to all outdoor gathering participants.', suggestedAction: 'Activate emergency evacuation plan. Direct crowds to covered shelter. Suspend all amplified equipment.', icon: 'CloudLightning' });
  if (w.windSpeed > 10) alerts.push({ id: 'a2', type: 'wind', severity: 'critical' as const, title: 'Structural Integrity Risk', description: `Wind at ${Math.round(w.windSpeed)} m/s threatens temporary stages, fencing, and marquees.`, suggestedAction: 'Inspect all structural anchoring. Remove lightweight promotional materials. Brief stage crew on wind protocol.', icon: 'Wind' });
  if (w.temperature > 35) alerts.push({ id: 'a3', type: 'heat', severity: 'warning' as const, title: 'Extreme Heat Warning', description: `Heat index of ${Math.round(w.feelsLike)}°C creates significant public health risk for outdoor crowds.`, suggestedAction: 'Deploy additional water stations, misting fans, and medical personnel. Increase shade coverage.', icon: 'Thermometer' });

  const impacts = [
    { area: 'Attendance & Experience', riskLevel: (score > 60 ? 'high' : score > 30 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Weather conditions will ${score > 60 ? 'significantly deter' : 'mildly affect'} attendee experience and arrival rates.`, icon: 'Users' },
    { area: 'Structural Safety', riskLevel: (w.windSpeed > 12 ? 'critical' : w.windSpeed > 8 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Wind load of ${Math.round(w.windSpeed)} m/s against temporary event structures.`, icon: 'Tent' },
    { area: 'AV & Stage Equipment', riskLevel: (w.rainProbability > 60 ? 'high' : w.rainProbability > 30 ? 'moderate' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: 'Rain exposure risk to electrical and audio-visual equipment.', icon: 'Mic' },
    { area: 'Medical Requirements', riskLevel: (w.temperature > 33 || w.uvIndex > 8 ? 'high' : 'minimal') as ScenarioResult['impactAreas'][0]['riskLevel'], explanation: `Heat and UV conditions may increase medical incident rates among attendees.`, icon: 'HeartPulse' },
  ];

  const actions = [];
  if (score > 70) actions.push({ id: 'r1', priority: 'urgent' as const, category: 'Safety', action: 'Activate venue evacuation plan', rationale: 'Conditions present immediate life-safety risk to attendees' });
  if (w.windSpeed > 8) actions.push({ id: 'r2', priority: 'high' as const, category: 'Infrastructure', action: 'Engineer inspection of all temporary structures', rationale: 'Confirm all staging and marquees meet wind load requirements' });
  if (w.rainProbability > 50) actions.push({ id: 'r3', priority: 'high' as const, category: 'Equipment', action: 'Deploy waterproof equipment covers', rationale: 'Protect stage electronics, sound systems, and lighting rigs' });
  if (w.temperature > 30) actions.push({ id: 'r4', priority: 'high' as const, category: 'Welfare', action: 'Activate heat welfare plan', rationale: 'Deploy additional water points, misting stations, and first aid' });
  actions.push({ id: 'r5', priority: 'medium' as const, category: 'Communications', action: 'Update attendees via SMS and social media', rationale: 'Communicate weather conditions, shelter locations, and advice' });

  const tRisks = [clamp(score * 0.5, 0, 100), clamp(score, 0, 100), clamp(score * 0.95, 0, 100), clamp(score * 0.3, 0, 100)];
  return {
    riskScore: score, operationalStatus: status,
    executiveSummary: `Outdoor event operations present ${score > 60 ? 'high' : score > 30 ? 'moderate' : 'acceptable'} risk. ${keyRisks[0] || 'Weather conditions are suitable for the planned event.'}`,
    operationalRecommendation: score > 80 ? 'Event must be cancelled or moved indoors. Activate public safety communications immediately.' : score > 60 ? 'Event viability is in question. Prepare contingency plans. Structural inspection is mandatory.' : score > 30 ? 'Event can proceed with enhanced safety measures and continuous weather monitoring.' : 'Event can proceed normally. Deploy standard safety protocols and maintain weather watch.',
    keyRisks, positiveFactors: positive, alerts, impactAreas: impacts, recommendedActions: actions, timeline: buildTimeline(w, tRisks),
  };
}
