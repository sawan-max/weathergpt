import {
  WeatherResponse,
  WeatherAlert,
  MissionResult,
  ScoreFactor,
  HourScore,
  TimeSlot,
  CarryItem,
  AvoidItem,
  ChecklistItem,
  BackupPlan,
  ActivityType,
  TransportMode,
  SelectedLocation,
  HourlyForecast,
  RainSeverity,
  ForecastConfidence,
} from './types';
import { getWeather } from './weather';
import { generateAlerts } from './weather';
import { getWeatherInfo } from './weatherCodes';

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  walking: 'Walking', running: 'Running', cycling: 'Cycling', bike_ride: 'Bike Ride',
  driving: 'Driving', travel: 'Travel', trekking: 'Trekking', hiking: 'Hiking',
  picnic: 'Picnic', outdoor_party: 'Outdoor Party', photography: 'Photography',
  sports: 'Sports', college: 'College', office: 'Office', shopping: 'Shopping',
  sightseeing: 'Sightseeing', camping: 'Camping', event: 'Event', other: 'Other',
};

export function getActivityLabel(activity: ActivityType): string { return ACTIVITY_LABELS[activity] || activity; }
export const ACTIVITY_OPTIONS: ActivityType[] = ['walking','running','cycling','bike_ride','driving','travel','trekking','hiking','picnic','outdoor_party','photography','sports','college','office','shopping','sightseeing','camping','event','other'];
export const TRANSPORT_OPTIONS: TransportMode[] = ['walking','bike','car','metro','bus','train','metro_walking','car_walking','bike_walking','public_transport'];

const TRANSPORT_LABELS: Record<TransportMode, string> = { walking:'Walking', bike:'Bike', car:'Car', metro:'Metro', bus:'Bus', train:'Train', metro_walking:'Metro + Walking', car_walking:'Car + Walking', bike_walking:'Bike + Walking', public_transport:'Public Transport' };
export function getTransportLabel(mode: TransportMode): string { return TRANSPORT_LABELS[mode] || mode; }

export interface MissionInput { location: SelectedLocation; date: string; startTime: string; endTime: string; activity: ActivityType; transportMode: TransportMode; notes?: string; }

interface ActivityWeights { temperature: number; rain: number; wind: number; humidity: number; visibility: number; uv: number; severeWeather: number; }

const ACTIVITY_WEIGHTS: Record<ActivityType, ActivityWeights> = {
  walking:       { temperature: 0.20, rain: 0.20, wind: 0.15, humidity: 0.10, visibility: 0.10, uv: 0.10, severeWeather: 0.15 },
  running:       { temperature: 0.25, rain: 0.20, wind: 0.10, humidity: 0.20, visibility: 0.05, uv: 0.10, severeWeather: 0.10 },
  cycling:       { temperature: 0.15, rain: 0.25, wind: 0.25, humidity: 0.05, visibility: 0.10, uv: 0.05, severeWeather: 0.15 },
  bike_ride:     { temperature: 0.15, rain: 0.25, wind: 0.25, humidity: 0.05, visibility: 0.15, uv: 0.05, severeWeather: 0.10 },
  driving:       { temperature: 0.05, rain: 0.30, wind: 0.15, humidity: 0.05, visibility: 0.30, uv: 0.00, severeWeather: 0.15 },
  travel:        { temperature: 0.10, rain: 0.20, wind: 0.15, humidity: 0.05, visibility: 0.20, uv: 0.05, severeWeather: 0.25 },
  trekking:      { temperature: 0.15, rain: 0.20, wind: 0.15, humidity: 0.10, visibility: 0.15, uv: 0.05, severeWeather: 0.20 },
  hiking:        { temperature: 0.15, rain: 0.20, wind: 0.15, humidity: 0.10, visibility: 0.15, uv: 0.05, severeWeather: 0.20 },
  picnic:        { temperature: 0.20, rain: 0.30, wind: 0.15, humidity: 0.10, visibility: 0.05, uv: 0.15, severeWeather: 0.05 },
  outdoor_party: { temperature: 0.20, rain: 0.25, wind: 0.15, humidity: 0.15, visibility: 0.05, uv: 0.10, severeWeather: 0.10 },
  photography:   { temperature: 0.10, rain: 0.20, wind: 0.15, humidity: 0.05, visibility: 0.20, uv: 0.10, severeWeather: 0.20 },
  sports:        { temperature: 0.20, rain: 0.20, wind: 0.15, humidity: 0.15, visibility: 0.10, uv: 0.10, severeWeather: 0.10 },
  college:       { temperature: 0.15, rain: 0.20, wind: 0.10, humidity: 0.10, visibility: 0.10, uv: 0.10, severeWeather: 0.25 },
  office:        { temperature: 0.10, rain: 0.20, wind: 0.10, humidity: 0.10, visibility: 0.10, uv: 0.05, severeWeather: 0.35 },
  shopping:      { temperature: 0.10, rain: 0.25, wind: 0.10, humidity: 0.05, visibility: 0.10, uv: 0.05, severeWeather: 0.35 },
  sightseeing:   { temperature: 0.20, rain: 0.20, wind: 0.10, humidity: 0.10, visibility: 0.15, uv: 0.15, severeWeather: 0.10 },
  camping:       { temperature: 0.15, rain: 0.20, wind: 0.20, humidity: 0.10, visibility: 0.10, uv: 0.05, severeWeather: 0.20 },
  event:         { temperature: 0.15, rain: 0.25, wind: 0.15, humidity: 0.10, visibility: 0.05, uv: 0.10, severeWeather: 0.20 },
  other:         { temperature: 0.15, rain: 0.20, wind: 0.15, humidity: 0.10, visibility: 0.15, uv: 0.10, severeWeather: 0.15 },
};

const RAIN_AMOUNT_THRESHOLDS = { light: 2.5, moderate: 7.5, heavy: 15.0, severe: 30.0 };

export function classifyRainSeverity(probability: number, amountMm: number): RainSeverity {
  if (probability < 20 && amountMm < 1.0) return 'NONE';
  if (amountMm < RAIN_AMOUNT_THRESHOLDS.light) return 'LIGHT';
  if (amountMm < RAIN_AMOUNT_THRESHOLDS.moderate) return 'MODERATE';
  if (amountMm < RAIN_AMOUNT_THRESHOLDS.heavy) return 'HEAVY';
  return 'SEVERE';
}

export function rainSeverityLabel(severity: RainSeverity): string {
  switch (severity) { case 'NONE': return 'No rain expected'; case 'LIGHT': return 'Light precipitation'; case 'MODERATE': return 'Moderate rain'; case 'HEAVY': return 'Heavy rain'; case 'SEVERE': return 'Severe rain'; }
}

function describeRain(probability: number, amountMm: number, severity: RainSeverity): string {
  const probDesc = `${probability}% chance`;
  const amtDesc = amountMm > 0 ? `${amountMm.toFixed(1)} mm expected` : 'minimal accumulation expected';
  if (severity === 'NONE') return `${probDesc}, ${amtDesc}. No significant rain expected.`;
  if (severity === 'LIGHT') return `High chance of light precipitation (${probDesc}, ${amtDesc}). Not heavy rain.`;
  if (severity === 'MODERATE') return `Moderate rain risk (${probDesc}, ${amtDesc}).`;
  if (severity === 'HEAVY') return `Heavy rain risk (${probDesc}, ${amtDesc}).`;
  return `Severe rain risk (${probDesc}, ${amtDesc}). Exercise caution.`;
}

function parseTimeToHour(timeStr: string): number { const match = timeStr.match(/(\d+)/); if (!match) return 9; let hour = parseInt(match[1], 10); if (timeStr.toLowerCase().includes('pm') && hour < 12) hour += 12; if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0; return hour; }
function hourToLabel(hour: number): string { if (hour === 0) return '12 AM'; if (hour < 12) return `${hour} AM`; if (hour === 12) return '12 PM'; return `${hour - 12} PM`; }

const ACTIVITY_TEMP_RANGES: Record<string, [number, number]> = { trekking: [10, 22], hiking: [10, 22], running: [8, 20], cycling: [12, 25], walking: [12, 28], picnic: [18, 30], outdoor_party: [18, 30], sightseeing: [15, 30], camping: [10, 25], photography: [10, 30], sports: [12, 28], driving: [5, 40] };

function scoreTemperature(temp: number, feelsLike: number, activity: ActivityType, weight: number): ScoreFactor {
  const range = ACTIVITY_TEMP_RANGES[activity] || [15, 30]; const val = feelsLike; let score = 100; let status: 'good' | 'caution' | 'bad' = 'good'; let detail = `${temp}°C (feels like ${feelsLike}°C)`; let penalty = 0;
  if (val < range[0]) { const diff = range[0] - val; penalty = Math.min(100, diff * 8); score = 100 - penalty; status = diff > 10 ? 'bad' : 'caution'; detail += ` — Below ideal range (${range[0]}–${range[1]}°C) for ${getActivityLabel(activity)}`; }
  else if (val > range[1]) { const diff = val - range[1]; penalty = Math.min(100, diff * 8); score = 100 - penalty; status = diff > 10 ? 'bad' : 'caution'; detail += ` — Above ideal range (${range[0]}–${range[1]}°C) for ${getActivityLabel(activity)}`; }
  else { detail += ` — Within ideal range for ${getActivityLabel(activity)}`; }
  return { label: 'Temperature', status, score: Math.round(score), penalty: Math.round(penalty), weight, detail };
}

function scoreRain(probability: number, amountMm: number, weight: number): ScoreFactor {
  const severity = classifyRainSeverity(probability, amountMm); let score = 100; let status: 'good' | 'caution' | 'bad' = 'good'; let penalty = 0; const detail = describeRain(probability, amountMm, severity);
  switch (severity) { case 'NONE': score = 100; penalty = 0; status = 'good'; break; case 'LIGHT': penalty = Math.round(probability * 0.15); score = 100 - penalty; status = 'caution'; break; case 'MODERATE': penalty = Math.round(probability * 0.3 + amountMm * 2); score = 100 - penalty; status = 'caution'; break; case 'HEAVY': penalty = Math.round(probability * 0.5 + amountMm * 3); score = Math.max(0, 100 - penalty); status = 'bad'; break; case 'SEVERE': penalty = Math.round(80 + amountMm * 2); score = Math.max(0, 100 - penalty); status = 'bad'; break; }
  return { label: 'Rain', status, score: Math.round(score), penalty: Math.round(penalty), weight, detail };
}

function scoreWind(maxWind: number, activity: ActivityType, weight: number): ScoreFactor {
  const windSensitive: ActivityType[] = ['cycling', 'bike_ride', 'photography', 'camping', 'trekking']; let score = 100; let status: 'good' | 'caution' | 'bad' = 'good'; let penalty = 0; let detail = `${maxWind} km/h max wind`;
  if (maxWind >= 40) { penalty = Math.min(100, (maxWind - 30) * 3); score = Math.max(0, 100 - penalty); status = 'bad'; detail += ' — Strong wind, may affect activities'; }
  else if (maxWind >= 25) { penalty = Math.min(100, (maxWind - 20) * 2); score = Math.max(0, 100 - penalty); status = windSensitive.includes(activity) ? 'caution' : 'good'; if (status === 'caution') detail += ` — Caution for ${getActivityLabel(activity)}`; else detail += ' — Moderate, unlikely to significantly affect activities'; }
  else { detail += ' — Calm to moderate'; }
  return { label: 'Wind', status, score: Math.round(score), penalty: Math.round(penalty), weight, detail };
}

function scoreHumidity(maxHumidity: number, activity: ActivityType, weight: number): ScoreFactor {
  const outdoorActive: ActivityType[] = ['running', 'trekking', 'hiking', 'cycling', 'sports']; let score = 100; let status: 'good' | 'caution' | 'bad' = 'good'; let penalty = 0; let detail = `${maxHumidity}% humidity`;
  if (maxHumidity >= 85 && outdoorActive.includes(activity)) { penalty = Math.min(100, (maxHumidity - 70) * 2); score = Math.max(0, 100 - penalty); status = 'caution'; detail += ` — High for active ${getActivityLabel(activity)}`; }
  else if (maxHumidity >= 90) { penalty = Math.min(100, (maxHumidity - 75) * 1.5); score = Math.max(0, 100 - penalty); status = 'caution'; detail += ' — Very humid, may feel uncomfortable'; }
  else if (maxHumidity < 20) { penalty = 20; score = 80; status = 'caution'; detail += ' — Very dry, stay hydrated'; }
  else { detail += ' — Comfortable range'; }
  return { label: 'Humidity', status, score: Math.round(score), penalty: Math.round(penalty), weight, detail };
}

function scoreVisibility(minVisibility: number, weight: number): ScoreFactor {
  let score = 100; let status: 'good' | 'caution' | 'bad' = 'good'; let penalty = 0; let detail = minVisibility > 0 ? `${Math.round(minVisibility / 1000)} km visibility` : 'Visibility data N/A';
  if (minVisibility > 0 && minVisibility < 1000) { penalty = 80; score = 20; status = 'bad'; detail += ' — Very poor visibility, hazardous for driving'; }
  else if (minVisibility > 0 && minVisibility < 5000) { penalty = 40; score = 60; status = 'caution'; detail += ' — Reduced visibility, drive cautiously'; }
  else if (minVisibility > 0) { detail += ' — Good visibility'; }
  return { label: 'Visibility', status, score: Math.round(score), penalty: Math.round(penalty), weight, detail };
}

function scoreUV(maxUV: number, activity: ActivityType, weight: number): ScoreFactor {
  const outdoor: ActivityType[] = ['picnic', 'outdoor_party', 'sightseeing', 'photography', 'sports', 'trekking', 'hiking', 'camping'];
  if (!outdoor.includes(activity) || weight === 0) return { label: 'UV Index', status: 'good', score: 100, penalty: 0, weight, detail: maxUV > 0 ? `UV ${maxUV} — Indoor activity, UV not a major factor` : 'UV data N/A' };
  let score = 100; let status: 'good' | 'caution' | 'bad' = 'good'; let penalty = 0; let detail = `UV ${maxUV}`;
  if (maxUV >= 11) { penalty = 70; score = 30; status = 'bad'; detail += ' — Extreme UV, avoid direct sun exposure'; }
  else if (maxUV >= 8) { penalty = 50; score = 50; status = 'caution'; detail += ' — Very high UV, use sun protection'; }
  else if (maxUV >= 6) { penalty = 25; score = 75; status = 'caution'; detail += ' — High UV, wear sunscreen and sunglasses'; }
  else { detail += ' — Moderate to low UV'; }
  return { label: 'UV Index', status, score: Math.round(score), penalty: Math.round(penalty), weight, detail };
}

function scoreSevereWeather(alerts: WeatherAlert[], weight: number): ScoreFactor {
  if (alerts.length === 0) return { label: 'Severe Weather', status: 'good', score: 100, penalty: 0, weight, detail: 'No active severe weather warnings' };
  const severe = alerts.filter((a) => a.severity === 'severe' || a.severity === 'extreme'); const warnings = alerts.filter((a) => a.severity === 'warning'); let penalty = 0; let status: 'good' | 'caution' | 'bad' = 'good'; let detail = '';
  if (severe.length > 0) { penalty = 80; status = 'bad'; detail = `${severe.length} severe warning(s): ${severe.map((a) => a.title).join(', ')}`; }
  else if (warnings.length > 0) { penalty = 40; status = 'caution'; detail = `${warnings.length} weather warning(s): ${warnings.map((a) => a.title).join(', ')}`; }
  else { penalty = 15; status = 'caution'; detail = `${alerts.length} minor alert(s) active`; }
  return { label: 'Severe Weather', status, score: Math.max(0, 100 - penalty), penalty, weight, detail };
}

function scoreHour(hourData: HourlyForecast, activity: ActivityType, weights: ActivityWeights, dailyPrecipSum: number): HourScore {
  const severity = classifyRainSeverity(hourData.precipitationProbability, dailyPrecipSum / 24);
  const tempScore = Math.max(0, 100 - calcTempPenalty(hourData.temperature, activity));
  const rainScore = Math.max(0, 100 - calcRainPenalty(hourData.precipitationProbability, dailyPrecipSum / 24));
  const windScore = Math.max(0, 100 - calcWindPenalty(hourData.windSpeed, activity));
  const score = Math.round(tempScore * weights.temperature + rainScore * weights.rain + windScore * weights.wind + 100 * weights.visibility + 100 * weights.uv);
  let status: HourScore['status'] = 'good'; let reason = '';
  if (score >= 75) { status = 'good'; reason = 'Favorable conditions'; } else if (score >= 55) { status = 'caution'; reason = 'Acceptable with minor concerns'; } else if (score >= 40) { status = 'moderate'; reason = 'Moderate weather concerns'; } else { status = 'bad'; reason = 'Unfavorable conditions'; }
  if (hourData.precipitationProbability >= 60 && severity === 'LIGHT') reason = `High chance of light rain (${hourData.precipitationProbability}%)`;
  else if (hourData.precipitationProbability >= 60 && severity !== 'NONE') reason = `Rain risk (${hourData.precipitationProbability}%, ${rainSeverityLabel(severity)})`;
  if (hourData.windSpeed >= 35) reason += `; strong wind (${hourData.windSpeed} km/h)`;
  const info = getWeatherInfo(hourData.weatherCode); const hour = new Date(hourData.time).getHours();
  return { hour, label: hourToLabel(hour), score, temperature: hourData.temperature, rainProbability: hourData.precipitationProbability, precipitation: dailyPrecipSum / 24, windSpeed: hourData.windSpeed, humidity: 0, weatherCode: hourData.weatherCode, description: info.description, rainSeverity: severity, reason, status };
}

function calcTempPenalty(temp: number, activity: ActivityType): number { const range = ACTIVITY_TEMP_RANGES[activity] || [15, 30]; if (temp < range[0]) return Math.min(100, (range[0] - temp) * 8); if (temp > range[1]) return Math.min(100, (temp - range[1]) * 8); return 0; }
function calcRainPenalty(probability: number, amountMm: number): number { const severity = classifyRainSeverity(probability, amountMm); switch (severity) { case 'NONE': return 0; case 'LIGHT': return Math.round(probability * 0.15); case 'MODERATE': return Math.round(probability * 0.3 + amountMm * 2); case 'HEAVY': return Math.round(probability * 0.5 + amountMm * 3); case 'SEVERE': return Math.round(80 + amountMm * 2); } }
function calcWindPenalty(wind: number, activity: ActivityType): number { const windSensitive: ActivityType[] = ['cycling', 'bike_ride', 'photography', 'camping', 'trekking']; if (wind >= 40) return Math.min(100, (wind - 30) * 3); if (wind >= 25) return windSensitive.includes(activity) ? Math.min(100, (wind - 20) * 2) : 0; return 0; }

function buildTimeline(weather: WeatherResponse, startHour: number, endHour: number, targetDate: string, activity: ActivityType, weights: ActivityWeights, dailyPrecipSum: number): { slots: TimeSlot[]; hourScores: HourScore[] } {
  const slots: TimeSlot[] = []; const hourScores: HourScore[] = [];
  for (let h = startHour; h < endHour; h++) {
    const hourData = weather.hourly.find((hData) => { const d = new Date(hData.time); const target = new Date(targetDate); target.setHours(h, 0, 0, 0); return d.toDateString() === target.toDateString() && d.getHours() === h; });
    if (!hourData) { const idx = Math.max(0, Math.min(h, weather.hourly.length - 1)); const fallback = weather.hourly[idx]; if (fallback) { const hs = scoreHour(fallback, activity, weights, dailyPrecipSum); hourScores.push(hs); slots.push(makeSlot(h, h + 1, fallback, hs, dailyPrecipSum)); } continue; }
    const hs = scoreHour(hourData, activity, weights, dailyPrecipSum); hourScores.push(hs); slots.push(makeSlot(h, h + 1, hourData, hs, dailyPrecipSum));
  }
  return { slots, hourScores };
}

function makeSlot(startH: number, endH: number, hourData: HourlyForecast, hs: HourScore, dailyPrecipSum: number): TimeSlot { return { startHour: startH, endHour: endH, label: `${hourToLabel(startH)} – ${hourToLabel(endH)}`, status: hs.status, temperature: hourData.temperature, rainProbability: hourData.precipitationProbability, precipitation: dailyPrecipSum / 24, windSpeed: hourData.windSpeed, humidity: 0, weatherCode: hourData.weatherCode, description: hs.description, reason: hs.reason, score: hs.score, rainSeverity: hs.rainSeverity }; }

function findBestTime(hourScores: HourScore[]): { start: string; end: string } { if (hourScores.length === 0) return { start: 'N/A', end: 'N/A' }; const goodHours = hourScores.filter((h) => h.score >= 70); if (goodHours.length >= 2) { let bestStart = goodHours[0].hour; let bestEnd = goodHours[0].hour + 1; let maxLen = 1; let curStart = goodHours[0].hour; let curLen = 1; for (let i = 1; i < goodHours.length; i++) { if (goodHours[i].hour === goodHours[i - 1].hour + 1) { curLen++; if (curLen > maxLen) { maxLen = curLen; bestStart = curStart; bestEnd = goodHours[i].hour + 1; } } else { curStart = goodHours[i].hour; curLen = 1; } } return { start: hourToLabel(bestStart), end: hourToLabel(bestEnd) }; } const best = hourScores.reduce((max, h) => (h.score > max.score ? h : max)); return { start: hourToLabel(best.hour), end: hourToLabel(best.hour + 1) }; }
function findAvoidTime(hourScores: HourScore[]): { start: string; end: string } | null { const badHours = hourScores.filter((h) => h.score < 50); if (badHours.length === 0) return null; let worst = badHours[0]; for (const h of badHours) if (h.score < worst.score) worst = h; return { start: hourToLabel(worst.hour), end: hourToLabel(worst.hour + 1) }; }

function generateWeatherGear(maxRainProb: number, maxPrecip: number, rainSeverity: RainSeverity, maxUV: number, maxTemp: number, minTemp: number, feelsLike: number, maxWind: number, activity: ActivityType, hourScores: HourScore[]): CarryItem[] {
  const items: CarryItem[] = []; const hasRain = rainSeverity !== 'NONE' || maxRainProb >= 30; const hasHeavyRain = rainSeverity === 'HEAVY' || rainSeverity === 'SEVERE'; const peakRainHour = hourScores.find((h) => h.rainProbability >= 50);
  if (hasRain) { items.push({ name: 'Compact umbrella', icon: 'umbrella', reason: peakRainHour ? `Rain probability peaks at ${peakRainHour.rainProbability}% around ${peakRainHour.label}. ${rainSeverityLabel(rainSeverity)}.` : `Rain probability up to ${maxRainProb}%. ${rainSeverityLabel(rainSeverity)}.`, trigger: `Rain probability >= 30% (${maxRainProb}%)`, priority: hasHeavyRain ? 'essential' : 'recommended', category: 'weather_gear' }); items.push({ name: 'Light rain jacket', icon: 'rain-jacket', reason: hasHeavyRain ? 'Heavy rain expected — a jacket provides better protection than an umbrella alone.' : 'Protection against unexpected showers.', trigger: `Rain severity: ${rainSeverity}`, priority: hasHeavyRain ? 'essential' : 'recommended', category: 'weather_gear' }); items.push({ name: 'Waterproof bag cover', icon: 'waterproof-bag', reason: hasRain ? 'Protect electronics and documents from moisture.' : '', trigger: `Rain probability ${maxRainProb}%`, priority: 'recommended', category: 'weather_gear' }); }
  if (maxUV >= 6) { items.push({ name: 'Sunglasses', icon: 'sunglasses', reason: `UV index peaks at ${maxUV} — protect your eyes from UV exposure.`, trigger: `UV index >= 6 (${maxUV})`, priority: 'recommended', category: 'weather_gear' }); items.push({ name: 'Sunscreen (SPF 30+)', icon: 'sunscreen', reason: `UV index ${maxUV} — sunburn risk is elevated during your selected period.`, trigger: `UV index >= 6 (${maxUV})`, priority: 'recommended', category: 'weather_gear' }); }
  if (minTemp <= 10 || feelsLike <= 10) items.push({ name: 'Warm layer', icon: 'jacket', reason: `Temperature may drop to ${minTemp}°C (feels like ${feelsLike}°C).`, trigger: `Temperature <= 10°C (${minTemp}°C)`, priority: 'essential', category: 'weather_gear' });
  if (maxWind >= 25) items.push({ name: 'Windbreaker', icon: 'windbreaker', reason: `Wind speeds up to ${maxWind} km/h expected during your activity.`, trigger: `Wind speed >= 25 km/h (${maxWind})`, priority: 'recommended', category: 'weather_gear' });
  if (activity === 'trekking' || activity === 'hiking' || activity === 'camping') items.push({ name: 'Sturdy waterproof shoes', icon: 'shoes', reason: `Essential for ${getActivityLabel(activity)} — proper footwear for terrain and weather.`, trigger: `Activity: ${getActivityLabel(activity)}`, priority: 'essential', category: 'weather_gear' });
  if (activity === 'photography' && (hasRain || maxUV >= 6)) items.push({ name: 'Lens cloth & camera cover', icon: 'camera', reason: hasRain ? 'Protect gear from moisture and clean lenses.' : 'High UV may cause lens flare — use a UV filter.', trigger: hasRain ? 'Rain risk' : `UV ${maxUV}`, priority: 'recommended', category: 'weather_gear' });
  return items;
}

function generateTripEssentials(activity: ActivityType, transportMode: TransportMode, duration: number, maxTemp: number): CarryItem[] {
  const items: CarryItem[] = []; const longDuration = duration > 6;
  if (longDuration || activity === 'travel' || activity === 'sightseeing' || activity === 'trekking' || activity === 'hiking') items.push({ name: 'Power bank', icon: 'power-bank', reason: 'Long outing — keep devices charged for navigation and communication.', trigger: `Duration > 6 hours (${duration}h)`, priority: 'recommended', category: 'trip_essential' });
  if (maxTemp >= 28 || longDuration) items.push({ name: 'Water bottle', icon: 'water', reason: maxTemp >= 28 ? `Temperature reaches ${maxTemp}°C — stay hydrated.` : 'Long outing — stay hydrated.', trigger: maxTemp >= 28 ? `Temperature >= 28°C` : `Duration > 6h`, priority: 'essential', category: 'trip_essential' });
  if (transportMode === 'car' || transportMode === 'car_walking' || transportMode === 'bike' || transportMode === 'bike_walking') items.push({ name: 'Phone charger', icon: 'charger', reason: 'Keep navigation running during travel.', trigger: `Transport: ${getTransportLabel(transportMode)}`, priority: 'optional', category: 'trip_essential' });
  if (activity === 'trekking' || activity === 'hiking' || activity === 'camping') items.push({ name: 'First aid kit', icon: 'first-aid', reason: `Essential for remote ${getActivityLabel(activity)} activities.`, trigger: `Activity: ${getActivityLabel(activity)}`, priority: 'essential', category: 'trip_essential' });
  if (longDuration || activity === 'travel') items.push({ name: 'ID & wallet', icon: 'wallet', reason: 'Always carry identification and payment for longer outings.', trigger: `Duration > 6 hours`, priority: 'recommended', category: 'trip_essential' });
  return items;
}

function generateAvoidItems(maxTemp: number, minTemp: number, rainSeverity: RainSeverity, maxWind: number, activity: ActivityType): AvoidItem[] {
  const items: AvoidItem[] = []; const hasRain = rainSeverity !== 'NONE';
  if (maxTemp >= 25 && !hasRain) items.push({ name: 'Heavy woollen jacket', reason: `Temperature remains warm (up to ${maxTemp}°C) throughout the selected period.` });
  if (hasRain) { items.push({ name: 'Suede or leather shoes', reason: 'Rain risk — non-waterproof footwear will get damaged and uncomfortable.' }); items.push({ name: 'Non-waterproof bag', reason: 'Rain expected — protect electronics and documents in a waterproof bag.' }); }
  if (maxWind >= 30 && (activity === 'cycling' || activity === 'bike_ride')) items.push({ name: 'Loose-fitting clothing', reason: `Wind speeds up to ${maxWind} km/h — loose clothing creates drag and instability.` });
  if (maxTemp >= 35) items.push({ name: 'Dark-colored heavy clothing', reason: 'High heat — dark heavy fabrics trap heat and increase discomfort.' });
  if (minTemp <= 5 && !hasRain) items.push({ name: 'Short-sleeve only outfit', reason: `Temperature may drop to ${minTemp}°C — insufficient for cold conditions.` });
  return items;
}

function generateChecklist(weather: WeatherResponse, weatherGear: CarryItem[], tripEssentials: CarryItem[], activity: ActivityType, transportMode: TransportMode, departureStatus: string): ChecklistItem[] {
  const items: ChecklistItem[] = []; const c = weather.current;
  const hasRain = weatherGear.some((i) => i.icon === 'umbrella'); const hasWarm = weatherGear.some((i) => i.icon === 'jacket'); const hasSun = weatherGear.some((i) => i.icon === 'sunglasses'); const hasWater = tripEssentials.some((i) => i.icon === 'water'); const hasPowerBank = tripEssentials.some((i) => i.icon === 'power-bank'); const hasWind = weatherGear.some((i) => i.icon === 'windbreaker');
  if (hasRain) items.push({ label: 'Umbrella', icon: 'umbrella', status: 'ready', reason: 'Rain risk detected — umbrella recommended.' });
  if (hasWater) items.push({ label: 'Water bottle', icon: 'water', status: 'ready', reason: 'Stay hydrated during your activity.' });
  if (hasPowerBank) items.push({ label: 'Power bank', icon: 'power-bank', status: 'warning', reason: 'Ensure it is charged before leaving.' });
  if (hasWarm) items.push({ label: 'Warm layer', icon: 'jacket', status: 'ready', reason: 'Temperature may drop — bring a warm layer.' });
  if (activity === 'trekking' || activity === 'hiking') items.push({ label: 'Sturdy shoes', icon: 'shoes', status: 'ready', reason: 'Proper footwear essential for terrain.' });
  if (hasSun) items.push({ label: 'Sunglasses', icon: 'sunglasses', status: 'ready', reason: 'UV protection needed.' });
  if (hasWind) items.push({ label: 'Secure loose items', icon: 'wind', status: 'warning', reason: `Wind up to ${c.windSpeed} km/h — secure loose objects.` });
  if (transportMode === 'car' || transportMode === 'car_walking') { const poorVis = c.visibility > 0 && c.visibility < 5000; items.push({ label: 'Check visibility', icon: 'visibility', status: poorVis ? 'warning' : 'ready', reason: poorVis ? `Visibility is ${Math.round(c.visibility / 1000)} km — drive cautiously.` : 'Visibility is good for driving.' }); }
  if (items.length === 0) items.push({ label: 'Phone', icon: 'phone', status: 'ready', reason: 'Keep your phone charged for emergencies.' });
  return items;
}

function computeDepartureStatus(checklist: ChecklistItem[], missionScore: number, hasOfficialWarning: boolean): 'READY' | 'READY_WITH_PRECAUTIONS' | 'NOT_RECOMMENDED' { if (hasOfficialWarning) return 'NOT_RECOMMENDED'; const warnings = checklist.filter((i) => i.status === 'warning').length; const missing = checklist.filter((i) => i.status === 'missing').length; if (missing > 0 || missionScore < 40) return 'NOT_RECOMMENDED'; if (warnings > 0 || missionScore < 70) return 'READY_WITH_PRECAUTIONS'; return 'READY'; }

function generateBackupPlans(missionScore: number, activity: ActivityType, hourScores: HourScore[], bestTime: { start: string; end: string }, rainSeverity: RainSeverity, hasOfficialWarning: boolean): BackupPlan[] {
  const plans: BackupPlan[] = []; const activityLabel = getActivityLabel(activity); const isOutdoor: ActivityType[] = ['picnic', 'outdoor_party', 'sightseeing', 'trekking', 'hiking', 'camping', 'sports', 'photography', 'event'];
  plans.push({ planLabel: 'A', title: `${activityLabel} as planned`, score: missionScore, status: hasOfficialWarning ? 'RISKY — OFFICIAL WARNING ACTIVE' : missionScore >= 70 ? 'GOOD' : missionScore >= 50 ? 'GOOD WITH PRECAUTIONS' : 'RISKY', mainRisk: rainSeverity !== 'NONE' ? `Rain: ${rainSeverityLabel(rainSeverity)}` : hourScores[0]?.reason || 'Weather variability', suggestedTiming: 'As originally planned', whatChanges: 'Nothing changes — proceed as planned.', advantages: 'No rescheduling needed.', disadvantages: missionScore < 60 ? 'Weather conditions may be unfavorable.' : 'Minimal concerns.' });
  if (isOutdoor.includes(activity)) { const indoorScore = Math.min(95, missionScore + (hasOfficialWarning ? 35 : 25)); plans.push({ planLabel: 'B', title: 'Move to indoor venue / indoor activity', score: indoorScore, status: indoorScore >= 70 ? 'RECOMMENDED' : 'GOOD', mainRisk: 'None — weather-independent', suggestedTiming: 'Same time, indoor location', whatChanges: 'Relocate the activity indoors. Choose a covered venue, mall, or indoor sports facility.', advantages: 'Completely avoids weather risk. No rain, wind, or UV concerns.', disadvantages: 'Loses the outdoor experience.' }); }
  const goodHours = hourScores.filter((h) => h.score >= 70); if (goodHours.length > 0) { const rescheduleScore = Math.min(92, missionScore + 15); plans.push({ planLabel: 'C', title: `Reschedule to ${bestTime.start} – ${bestTime.end}`, score: rescheduleScore, status: rescheduleScore >= 70 ? 'GOOD' : 'BETTER THAN ORIGINAL', mainRisk: 'Shorter window — less flexible timing', suggestedTiming: `${bestTime.start} – ${bestTime.end}`, whatChanges: `Shift the activity to the best weather window: ${bestTime.start} – ${bestTime.end}.`, advantages: 'Maximizes favorable weather conditions based on hourly scoring.', disadvantages: 'May not fit your schedule.' }); }
  return plans;
}

function computeConfidence(weather: WeatherResponse, targetDate: string): { confidence: ForecastConfidence; reason: string } {
  const today = new Date(); const target = new Date(targetDate); const daysAhead = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysAhead <= 1) return { confidence: 'HIGH', reason: 'Forecast is within 24-48 hours, where model accuracy is highest.' };
  if (daysAhead <= 3) return { confidence: 'MEDIUM', reason: 'Forecast is 2-3 days out. General conditions are reliable, but precise timing of rain may shift.' };
  return { confidence: 'LOW', reason: 'Forecast is more than 3 days away. Conditions may change significantly. Check again closer to your planned date.' };
}

function generateSummary(missionScore: number, scoreStatus: string, bestTime: { start: string; end: string }, avoidTime: { start: string; end: string } | null, activity: ActivityType, locationName: string, rainSeverity: RainSeverity, rainSummary: string, hasOfficialWarning: boolean, confidence: ForecastConfidence): string {
  let summary = `Mission Score: ${missionScore}/100 — ${scoreStatus}.\n\nBest time for ${getActivityLabel(activity)}: ${bestTime.start} – ${bestTime.end}.\n`;
  if (avoidTime) summary += `Avoid: ${avoidTime.start} – ${avoidTime.end} due to highest combined weather penalty.\n`;
  summary += `\nRain: ${rainSummary}\n`;
  if (hasOfficialWarning) summary += `\n⚠️ Official weather warning is active. This takes priority over the mission score. Follow official guidance.\n`;
  summary += `\nForecast confidence: ${confidence}.`;
  summary += `\n\nThis is decision-support information, not a guaranteed prediction. Always prioritize official weather warnings.`;
  return summary;
}

export async function analyzeMission(input: MissionInput): Promise<MissionResult> {
  const { location, date, startTime, endTime, activity, transportMode } = input;
  const startHour = parseTimeToHour(startTime); const endHour = parseTimeToHour(endTime); const duration = Math.max(1, endHour - startHour); const weights = ACTIVITY_WEIGHTS[activity] || ACTIVITY_WEIGHTS.other;
  const locationName = `${location.city}, ${location.state}, ${location.country}`;
  const weather = await getWeather(location.latitude, location.longitude, locationName);
  const alerts = generateAlerts(weather);
  const dailyPrecipSum = weather.daily[0]?.precipitationSum || 0;
  const { slots, hourScores } = buildTimeline(weather, startHour, endHour, date, activity, weights, dailyPrecipSum);
  const relevantHours: HourlyForecast[] = slots.length > 0 ? slots.map((s) => weather.hourly.find((h) => new Date(h.time).getHours() === s.startHour)).filter((h): h is HourlyForecast => h !== undefined) : weather.hourly.slice(0, Math.max(1, duration));
  const temps = relevantHours.map((h) => h.temperature); const maxTemp = temps.length > 0 ? Math.max(...temps) : weather.current.temperature; const minTemp = temps.length > 0 ? Math.min(...temps) : weather.current.temperature; const feelsLike = weather.current.feelsLike;
  const maxRainProb = Math.max(...relevantHours.map((h) => h.precipitationProbability), 0); const maxWind = Math.max(...relevantHours.map((h) => h.windSpeed), weather.current.windSpeed);
  const maxHumidity = weather.current.humidity; const minVis = weather.current.visibility; const maxUV = weather.daily[0]?.uvIndexMax || weather.current.uvIndex;
  const rainSeverity = classifyRainSeverity(maxRainProb, dailyPrecipSum); const rainSummary = describeRain(maxRainProb, dailyPrecipSum, rainSeverity);
  const factors: ScoreFactor[] = [ scoreTemperature(maxTemp, feelsLike, activity, weights.temperature), scoreRain(maxRainProb, dailyPrecipSum, weights.rain), scoreWind(maxWind, activity, weights.wind), scoreHumidity(maxHumidity, activity, weights.humidity), scoreVisibility(minVis, weights.visibility), scoreUV(maxUV, activity, weights.uv), scoreSevereWeather(alerts, weights.severeWeather) ];
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0); const missionScore = Math.round(factors.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight);
  let scoreStatus = 'EXCELLENT'; if (missionScore < 40) scoreStatus = 'RISKY — RECONSIDER'; else if (missionScore < 55) scoreStatus = 'CAUTION'; else if (missionScore < 70) scoreStatus = 'GOOD WITH PRECAUTIONS'; else if (missionScore < 85) scoreStatus = 'GOOD';
  const hasOfficialWarning = alerts.some((a) => a.severity === 'severe' || a.severity === 'extreme' || a.severity === 'warning');
  const officialWarningSummary = hasOfficialWarning ? alerts.filter((a) => a.severity === 'severe' || a.severity === 'extreme' || a.severity === 'warning').map((a) => `${a.title}: ${a.description}`).join('; ') : null;
  const bestTime = findBestTime(hourScores); const avoidTime = findAvoidTime(hourScores);
  const weatherGear = generateWeatherGear(maxRainProb, dailyPrecipSum, rainSeverity, maxUV, maxTemp, minTemp, feelsLike, maxWind, activity, hourScores);
  const tripEssentials = generateTripEssentials(activity, transportMode, duration, maxTemp);
  const avoidItems = generateAvoidItems(maxTemp, minTemp, rainSeverity, maxWind, activity);
  const departureStatus = computeDepartureStatus([], missionScore, hasOfficialWarning);
  const checklist = generateChecklist(weather, weatherGear, tripEssentials, activity, transportMode, departureStatus);
  const finalDepartureStatus = computeDepartureStatus(checklist, missionScore, hasOfficialWarning);
  const plans = generateBackupPlans(missionScore, activity, hourScores, bestTime, rainSeverity, hasOfficialWarning);
  const { confidence, reason: confidenceReason } = computeConfidence(weather, date);
  const dataSource = 'Open-Meteo'; const lastUpdated = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); const forecastWindow = `${startTime} – ${endTime}`;
  const summary = generateSummary(missionScore, scoreStatus, bestTime, avoidTime, activity, locationName, rainSeverity, rainSummary, hasOfficialWarning, confidence);
  return { missionScore, scoreStatus, scoreFactors: factors, bestTime, avoidTime, avoidReason: avoidTime ? 'Highest combined weather penalty during this period.' : 'No significant weather risks detected.', timeline: slots, hourScores, weatherGear, tripEssentials, avoidItems, checklist, departureStatus: finalDepartureStatus, plans, summary, weather, alerts, rainSeverity, rainSummary, forecastConfidence: confidence, confidenceReason, dataSource, lastUpdated, forecastWindow, hasOfficialWarning, officialWarningSummary };
}

export function formatMissionResult(result: MissionResult, activity: ActivityType): string {
  let text = `MISSION SCORE: ${result.missionScore}/100\nStatus: ${result.scoreStatus}\n\n`;
  if (result.hasOfficialWarning && result.officialWarningSummary) text += `⚠️ OFFICIAL WEATHER WARNING:\n${result.officialWarningSummary}\n\nThis warning takes priority over the mission score.\n\n`;
  text += `Rain: ${result.rainSummary}\n\nWhy this score?\n`;
  for (const f of result.scoreFactors) { const icon = f.status === 'good' ? '✅' : f.status === 'caution' ? '⚠️' : '❌'; text += `${f.label}: ${icon} ${f.detail} (penalty: -${f.penalty}, weight: ${(f.weight * 100).toFixed(0)}%)\n`; }
  text += `\nBest time: ${result.bestTime.start} – ${result.bestTime.end}\n`;
  if (result.avoidTime) { text += `Avoid: ${result.avoidTime.start} – ${result.avoidTime.end}\n`; text += `Reason: ${result.avoidReason}\n`; }
  text += `\nWEATHER GEAR:\n`; for (const item of result.weatherGear) text += `✅ ${item.name} — ${item.reason}\n`;
  text += `\nTRIP ESSENTIALS:\n`; for (const item of result.tripEssentials) text += `✅ ${item.name} — ${item.reason}\n`;
  if (result.avoidItems.length > 0) { text += `\nDON'T CARRY:\n`; for (const item of result.avoidItems) text += `❌ ${item.name} — ${item.reason}\n`; }
  text += `\nDEPARTURE STATUS: ${result.departureStatus.replace(/_/g, ' ')}\n`;
  text += `\nFORECAST CONFIDENCE: ${result.forecastConfidence}\n`;
  text += `\nBACKUP PLANS:\n`; for (const plan of result.plans) text += `Plan ${plan.planLabel}: ${plan.title} (Score: ${plan.score}/100 — ${plan.status})\n`;
  text += `\n${result.summary}`;
  return text;
}
