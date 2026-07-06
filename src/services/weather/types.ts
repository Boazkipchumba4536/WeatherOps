// ============================================================
// WeatherAI API response types
// ============================================================

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherCurrent {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  rain?: { '1h': number };
  snow?: { '1h': number };
}

export interface WeatherHourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  pop: number; // probability of precipitation
  rain?: { '1h': number };
  snow?: { '1h': number };
}

export interface WeatherDailyTemp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface WeatherDailyFeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

export interface WeatherDaily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: WeatherDailyTemp;
  feels_like: WeatherDailyFeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface WeatherAPIResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: WeatherCurrent;
  hourly: WeatherHourly[];
  daily: WeatherDaily[];
  alerts?: WeatherAlert[];
}

export interface WeatherFetchParams {
  lat: number;
  lon: number;
  units?: 'metric' | 'imperial' | 'standard';
}

export interface NormalizedWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windDeg: number;
  visibility: number;
  cloudCover: number;
  uvIndex: number;
  dewPoint: number;
  rainProbability: number;
  rainAmount: number;
  snowAmount: number;
  condition: string;
  conditionId: number;
  icon: string;
  sunrise: number;
  sunset: number;
  isDay: boolean;
  units: 'metric' | 'imperial';
}
