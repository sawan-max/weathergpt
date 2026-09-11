export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  precipitation: number;
  weatherCode: number;
  description: string;
  icon: string;
  visibility: number;
  uvIndex: number;
  isDay: boolean;
  observedAt: string;
  latitude: number;
  longitude: number;
  locationName: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  description: string;
  icon: string;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
  latitude: number;
  longitude: number;
  locationName: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'severe' | 'extreme';
  startTime: string;
  endTime: string;
  area: string;
  eventType: string;
}

export interface ClimateRecord {
  month: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface ClimateData {
  locationName: string;
  latitude: number;
  longitude: number;
  records: ClimateRecord[];
  yearlyAvgTemp: number;
  yearlyTotalPrecipitation: number;
}

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'pa' | 'kn' | 'ml' | 'es' | 'fr';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  weatherData?: WeatherResponse | WeatherAlert[] | ClimateData | MissionResult | null;
  messageType: 'text' | 'weather' | 'alert' | 'climate' | 'forecast' | 'error' | 'state_summary' | 'mission';
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  language: Language;
  createdAt: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface SelectedLocation {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface UserPreferences {
  deviceId: string;
  language: Language;
  unit: 'celsius' | 'fahrenheit';
  voiceEnabled: boolean;
  autoLocation: boolean;
  theme: 'system' | 'light' | 'dark';
}

export type ActivityType =
  | 'walking' | 'running' | 'cycling' | 'bike_ride' | 'driving'
  | 'travel' | 'trekking' | 'hiking' | 'picnic' | 'outdoor_party'
  | 'photography' | 'sports' | 'college' | 'office' | 'shopping'
  | 'sightseeing' | 'camping' | 'event' | 'other';

export type TransportMode =
  | 'walking' | 'bike' | 'car' | 'metro' | 'bus' | 'train'
  | 'metro_walking' | 'car_walking' | 'bike_walking' | 'public_transport';

export interface Mission {
  id: string;
  deviceId: string;
  location: SelectedLocation;
  date: string;
  startTime: string;
  endTime: string;
  activity: ActivityType;
  transportMode: TransportMode;
  notes?: string;
  status: 'active' | 'completed' | 'archived';
  missionResult?: MissionResult;
  createdAt: string;
  updatedAt: string;
}

export type RainSeverity = 'NONE' | 'LIGHT' | 'MODERATE' | 'HEAVY' | 'SEVERE';
export type ForecastConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ScoreFactor {
  label: string;
  status: 'good' | 'caution' | 'bad';
  score: number;
  penalty: number;
  weight: number;
  detail: string;
}

export interface HourScore {
  hour: number;
  label: string;
  score: number;
  temperature: number;
  rainProbability: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
  description: string;
  rainSeverity: RainSeverity;
  reason: string;
  status: 'good' | 'caution' | 'moderate' | 'bad' | 'improving';
}

export interface TimeSlot {
  startHour: number;
  endHour: number;
  label: string;
  status: 'good' | 'caution' | 'moderate' | 'bad' | 'improving';
  temperature: number;
  rainProbability: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
  description: string;
  reason: string;
  score: number;
  rainSeverity: RainSeverity;
}

export interface CarryItem {
  name: string;
  icon: string;
  reason: string;
  trigger: string;
  priority: 'essential' | 'recommended' | 'optional';
  category: 'weather_gear' | 'trip_essential';
}

export interface AvoidItem {
  name: string;
  reason: string;
}

export interface BackupPlan {
  planLabel: 'A' | 'B' | 'C';
  title: string;
  score: number;
  status: string;
  mainRisk: string;
  suggestedTiming: string;
  whatChanges: string;
  advantages: string;
  disadvantages: string;
}

export interface ChecklistItem {
  label: string;
  icon: string;
  status: 'ready' | 'warning' | 'missing';
  reason: string;
}

export interface MissionResult {
  missionScore: number;
  scoreStatus: string;
  scoreFactors: ScoreFactor[];
  bestTime: { start: string; end: string };
  avoidTime: { start: string; end: string } | null;
  avoidReason: string;
  timeline: TimeSlot[];
  hourScores: HourScore[];
  weatherGear: CarryItem[];
  tripEssentials: CarryItem[];
  avoidItems: AvoidItem[];
  checklist: ChecklistItem[];
  departureStatus: 'READY' | 'READY_WITH_PRECAUTIONS' | 'NOT_RECOMMENDED';
  plans: BackupPlan[];
  summary: string;
  weather: WeatherResponse;
  alerts: WeatherAlert[];
  rainSeverity: RainSeverity;
  rainSummary: string;
  forecastConfidence: ForecastConfidence;
  confidenceReason: string;
  dataSource: string;
  lastUpdated: string;
  forecastWindow: string;
  hasOfficialWarning: boolean;
  officialWarningSummary: string | null;
}

export interface RouteSegment {
  name: string;
  latitude: number;
  longitude: number;
  weather: WeatherResponse;
  rainRisk: 'low' | 'medium' | 'high';
  visibilityStatus: 'good' | 'moderate' | 'poor';
  windStatus: 'calm' | 'moderate' | 'strong';
  hazardLevel: 'safe' | 'caution' | 'dangerous';
  conditionSummary: string;
}

export interface RouteResult {
  routeLabel: string;
  segments: RouteSegment[];
  totalDistance: number;
  weatherRiskScore: number;
  eta: string;
  status: string;
  recommendation: string;
  isRecommended: boolean;
}

export interface RiskContributor {
  label: string;
  level: number;
  description: string;
}

export interface RiskAssessment {
  locationName: string;
  overallRisk: 'low' | 'moderate' | 'high' | 'very_high';
  riskScore: number;
  contributors: RiskContributor[];
  explanation: string;
  disclaimer: string;
  isPrototype: boolean;
}

export interface PlanChangeAlert {
  id: string;
  missionId: string;
  type: 'rain_timing' | 'rain_intensity' | 'temperature' | 'wind' | 'visibility' | 'severe_weather';
  previousForecast: string;
  latestForecast: string;
  recommendedAction: string;
  severity: 'info' | 'warning' | 'severe';
  createdAt: string;
  dismissed: boolean;
}
