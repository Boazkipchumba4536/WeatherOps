import { BusinessScenario, OperationalReport } from '@/types';
import { WeatherInput, ScenarioResult, buildRiskScore, getOperationalStatus } from './types';
import { analyzeConstruction } from './scenarios/construction';
import { analyzeDeliveryFleet } from './scenarios/deliveryFleet';
import { analyzeOutdoorEvent } from './scenarios/outdoorEvent';
import { analyzeAgriculture } from './scenarios/agriculture';
import { analyzeDroneInspection } from './scenarios/droneInspection';
import { analyzeMotorcycleDelivery, analyzeRoadTransport } from './scenarios/transport';
import { analyzeUtilityMaintenance, analyzeEmergencyResponse } from './scenarios/utilities';
import { analyzeSchoolActivities, analyzeTourism, analyzePublicTransport, analyzeMarineOperations } from './scenarios/services';

const SCENARIO_HANDLERS: Record<BusinessScenario, (w: WeatherInput) => ScenarioResult> = {
  construction: analyzeConstruction,
  delivery_fleet: analyzeDeliveryFleet,
  outdoor_event: analyzeOutdoorEvent,
  agriculture: analyzeAgriculture,
  utility_maintenance: analyzeUtilityMaintenance,
  road_transport: analyzeRoadTransport,
  motorcycle_delivery: analyzeMotorcycleDelivery,
  drone_inspection: analyzeDroneInspection,
  emergency_response: analyzeEmergencyResponse,
  school_activities: analyzeSchoolActivities,
  tourism: analyzeTourism,
  public_transport: analyzePublicTransport,
  marine_operations: analyzeMarineOperations,
};

export function runBusinessEngine(
  scenario: BusinessScenario,
  weatherInput: WeatherInput,
  locationName: string,
  date: string,
): OperationalReport {
  const handler = SCENARIO_HANDLERS[scenario];
  if (!handler) {
    throw new Error(`Unknown business scenario: ${scenario}`);
  }

  const result = handler(weatherInput);
  const riskScore = buildRiskScore(result.riskScore);

  return {
    businessScenario: scenario,
    locationName,
    date,
    generatedAt: new Date().toISOString(),
    riskScore,
    operationalStatus: result.operationalStatus,
    executiveSummary: result.executiveSummary,
    operationalRecommendation: result.operationalRecommendation,
    keyRisks: result.keyRisks,
    positiveFactors: result.positiveFactors,
    alerts: result.alerts.map((a, i) => ({ ...a, id: `alert-${i}-${Date.now()}` })),
    impactAreas: result.impactAreas,
    recommendedActions: result.recommendedActions.map((a, i) => ({ ...a, id: `action-${i}-${Date.now()}` })),
    timeline: result.timeline,
  };
}
