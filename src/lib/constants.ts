import { BusinessScenario, RiskLevel } from '@/types';

export const SCENARIO_META: Record<
  BusinessScenario,
  { label: string; icon: string; description: string; color: string }
> = {
  construction: {
    label: 'Construction Site',
    icon: 'HardHat',
    description: 'Crane, concrete, and heavy equipment operations',
    color: 'amber',
  },
  delivery_fleet: {
    label: 'Delivery Fleet',
    icon: 'Truck',
    description: 'Vehicle fleet dispatch and routing',
    color: 'blue',
  },
  outdoor_event: {
    label: 'Outdoor Event',
    icon: 'CalendarDays',
    description: 'Concerts, markets, sports, and festivals',
    color: 'purple',
  },
  agriculture: {
    label: 'Agriculture',
    icon: 'Sprout',
    description: 'Crop spraying, harvesting, and irrigation',
    color: 'green',
  },
  utility_maintenance: {
    label: 'Utility Maintenance',
    icon: 'Zap',
    description: 'Electrical grid and utility field work',
    color: 'yellow',
  },
  road_transport: {
    label: 'Road Transport',
    icon: 'Route',
    description: 'Long-haul trucking and road logistics',
    color: 'slate',
  },
  motorcycle_delivery: {
    label: 'Motorcycle Delivery',
    icon: 'Bike',
    description: 'Last-mile courier and food delivery',
    color: 'orange',
  },
  drone_inspection: {
    label: 'Drone Inspection',
    icon: 'Radio',
    description: 'Aerial survey and infrastructure inspection',
    color: 'cyan',
  },
  emergency_response: {
    label: 'Emergency Response',
    icon: 'Siren',
    description: 'Search, rescue, and disaster response',
    color: 'red',
  },
  school_activities: {
    label: 'School Activities',
    icon: 'GraduationCap',
    description: 'Field trips, sports days, and outdoor classes',
    color: 'teal',
  },
  tourism: {
    label: 'Tourism',
    icon: 'MapPin',
    description: 'Tours, excursions, and visitor experiences',
    color: 'pink',
  },
  public_transport: {
    label: 'Public Transport',
    icon: 'Bus',
    description: 'Bus, tram, and ferry operations',
    color: 'indigo',
  },
  marine_operations: {
    label: 'Marine Operations',
    icon: 'Anchor',
    description: 'Vessel, port, and offshore operations',
    color: 'sky',
  },
};

export const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; min: number; max: number; color: string; bgColor: string; textColor: string }
> = {
  minimal: {
    label: 'Minimal Risk',
    min: 0,
    max: 20,
    color: '#22c55e',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    textColor: 'text-green-700 dark:text-green-400',
  },
  low: {
    label: 'Low Risk',
    min: 21,
    max: 40,
    color: '#84cc16',
    bgColor: 'bg-lime-50 dark:bg-lime-950/30',
    textColor: 'text-lime-700 dark:text-lime-400',
  },
  moderate: {
    label: 'Moderate Risk',
    min: 41,
    max: 60,
    color: '#f59e0b',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-700 dark:text-amber-400',
  },
  high: {
    label: 'High Risk',
    min: 61,
    max: 80,
    color: '#f97316',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    textColor: 'text-orange-700 dark:text-orange-400',
  },
  critical: {
    label: 'Critical',
    min: 81,
    max: 100,
    color: '#ef4444',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    textColor: 'text-red-700 dark:text-red-400',
  },
};

export const OPERATIONAL_STATUS_CONFIG = {
  GO: {
    label: 'Go',
    description: 'Conditions are favorable. Proceed as planned.',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/40',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  PROCEED_WITH_CAUTION: {
    label: 'Proceed with Caution',
    description: 'Conditions are acceptable. Apply standard precautions.',
    color: 'text-lime-700 dark:text-lime-400',
    bgColor: 'bg-lime-50 dark:bg-lime-950/40',
    borderColor: 'border-lime-200 dark:border-lime-800',
  },
  DELAY_RECOMMENDED: {
    label: 'Delay Recommended',
    description: 'Weather conditions may impact operations. Consider postponing.',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  HALT_OPERATIONS: {
    label: 'Halt Operations',
    description: 'Adverse conditions detected. Operations should be suspended.',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/40',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  CRITICAL_HALT: {
    label: 'Critical Halt',
    description: 'Dangerous conditions. Immediate cessation of all operations required.',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/40',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};

export const HISTORY_STORAGE_KEY = 'weatherops_history';
export const MAX_HISTORY_ENTRIES = 50;
export const GEOCODE_DEBOUNCE_MS = 400;
export const API_CACHE_TTL_MS = 15 * 60 * 1000; // 15 min
export const GEOCODE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hr
export const MAX_REQUESTS_PER_MINUTE = 30;
