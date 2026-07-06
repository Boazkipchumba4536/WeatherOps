// ============================================================
// Global Type Definitions for WeatherOps
// ============================================================

export type BusinessScenario =
  | 'construction'
  | 'delivery_fleet'
  | 'outdoor_event'
  | 'agriculture'
  | 'utility_maintenance'
  | 'road_transport'
  | 'motorcycle_delivery'
  | 'drone_inspection'
  | 'emergency_response'
  | 'school_activities'
  | 'tourism'
  | 'public_transport'
  | 'marine_operations';

export type RiskLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'critical';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type OperationalStatus =
  | 'GO'
  | 'PROCEED_WITH_CAUTION'
  | 'DELAY_RECOMMENDED'
  | 'HALT_OPERATIONS'
  | 'CRITICAL_HALT';

export interface RiskScore {
  value: number; // 0-100
  level: RiskLevel;
  label: string;
  color: string;
  bgColor: string;
}

export interface OperationalAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  suggestedAction: string;
  icon: string;
}

export interface ImpactArea {
  area: string;
  riskLevel: RiskLevel;
  explanation: string;
  icon: string;
}

export interface TimelineSlot {
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  timeRange: string;
  riskScore: number;
  riskLevel: RiskLevel;
  forecast: string;
  icon: string;
  recommendation: string;
  temperature?: number;
  rainProbability?: number;
}

export interface RecommendedAction {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  action: string;
  rationale: string;
}

export interface OperationalReport {
  businessScenario: BusinessScenario;
  locationName: string;
  date: string;
  generatedAt: string;
  riskScore: RiskScore;
  operationalStatus: OperationalStatus;
  executiveSummary: string;
  operationalRecommendation: string;
  keyRisks: string[];
  positiveFactors: string[];
  alerts: OperationalAlert[];
  impactAreas: ImpactArea[];
  recommendedActions: RecommendedAction[];
  timeline: TimelineSlot[];
}

export interface HistoryEntry {
  id: string;
  businessScenario: BusinessScenario;
  locationName: string;
  date: string;
  analyzedAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  operationalStatus: OperationalStatus;
  lat?: number;
  lon?: number;
}

export interface AnalysisFormValues {
  locationName: string;
  lat: number;
  lon: number;
  date: string;
  businessScenario: BusinessScenario;
  units: 'metric' | 'imperial';
}

export interface DashboardMetrics {
  overallRisk: number;
  riskLevel: RiskLevel;
  activeAlerts: number;
  criticalAlerts: number;
  recommendedOperations: number;
  safetyStatus: OperationalStatus;
}
