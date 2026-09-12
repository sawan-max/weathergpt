import {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherResponse,
  WeatherAlert,
  ClimateData,
  ClimateRecord,
} from './types';
import { getWeatherInfo } from './weatherCodes';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/reverse';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export async function searchLocations(query: string): Promise<
  Array<{ name: string; latitude: number; longitude: number; country: string; admin1?: string }>
> {
  if (!query || query.trim().length < 2) return [];
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: any) => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country || '',
    admin1: r.admin1,
  }));
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ name: string; country: string; admin1?: string } | null> {
  try {
    const url = `${REVERSE_GEOCODING_URL}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('reverse geocode failed');
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const r = data.results[0];
      return { name: r.name, country: r.country || '', admin1: r.admin1 };
    }
  } catch {
    // reverse geocoding may not always be available
  }
  return { name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, country: '', admin1: '' };
}

export async function getWeather(
  latitude: number,
  longitude: number,
  locationName?: string
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility,uv_index',
    'hourly': 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
    'daily': 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,sunrise,sunset,uv_index_max',
    'timezone': 'auto',
    'forecast_days': '7',
    'temperature_unit': 'celsius',
    'wind_speed_unit': 'kmh',
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  const resolvedName = locationName || (await reverseGeocode(latitude, longitude))?.name || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  const currentInfo = getWeatherInfo(data.current.weather_code);

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    pressure: Math.round(data.current.pressure_msl),
    cloudCover: data.current.cloud_cover,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    description: currentInfo.description,
    icon: currentInfo.icon,
    visibility: Math.round(data.current.visibility || 0),
    uvIndex: Math.round(data.current.uv_index || 0),
    isDay: data.current.is_day === 1,
    observedAt: data.current.time,
    latitude,
    longitude,
    locationName: resolvedName,
  };

  const hourly: HourlyForecast[] = [];
  const nowHourIdx = data.hourly.time.findIndex((t: string) => new Date(t).getTime() >= Date.now() - 3600000);
  const startIdx = nowHourIdx >= 0 ? nowHourIdx : 0;
  for (let i = startIdx; i < Math.min(startIdx + 24, data.hourly.time.length); i++) {
    const info = getWeatherInfo(data.hourly.weather_code[i]);
    hourly.push({
      time: data.hourly.time[i],
      temperature: Math.round(data.hourly.temperature_2m[i]),
      precipitationProbability: data.hourly.precipitation_probability[i] || 0,
      weatherCode: data.hourly.weather_code[i],
      description: info.description,
      icon: info.icon,
      windSpeed: Math.round(data.hourly.wind_speed_10m[i] || 0),
    });
  }

  const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => {
    const info = getWeatherInfo(data.daily.weather_code[i]);
    return {
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      weatherCode: data.daily.weather_code[i],
      description: info.description,
      icon: info.icon,
      precipitationProbability: data.daily.precipitation_probability_max[i] || 0,
      precipitationSum: data.daily.precipitation_sum[i] || 0,
      windSpeedMax: Math.round(data.daily.wind_speed_10m_max[i] || 0),
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      uvIndexMax: Math.round(data.daily.uv_index_max[i] || 0),
    };
  });

  return { current, hourly, daily, timezone: data.timezone, latitude, longitude, locationName: resolvedName };
}

export async function getClimate(
  latitude: number,
  longitude: number,
  locationName?: string
): Promise<ClimateData> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startYear = Math.max(currentYear - 10, 1940);

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    'start_date': `${startYear}-01-01`,
    'end_date': `${currentYear - 1}-12-31`,
    'daily': 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_mean',
    'timezone': 'auto',
  });

  const res = await fetch(`${ARCHIVE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Climate API error: ${res.status}`);
  const data = await res.json();

  const monthlyData: Record<number, { tempSum: number; tempMin: number; tempMax: number; precipSum: number; humiditySum: number; windSum: number; count: number }> = {};
  for (let m = 0; m < 12; m++) {
    monthlyData[m] = { tempSum: 0, tempMin: Infinity, tempMax: -Infinity, precipSum: 0, humiditySum: 0, windSum: 0, count: 0 };
  }

  for (let i = 0; i < data.daily.time.length; i++) {
    const date = new Date(data.daily.time[i]);
    const month = date.getMonth();
    const md = monthlyData[month];
    const tempMean = data.daily.temperature_2m_mean[i];
    const tempMin = data.daily.temperature_2m_min[i];
    const tempMax = data.daily.temperature_2m_max[i];
    const precip = data.daily.precipitation_sum[i] || 0;
    const humidity = data.daily.relative_humidity_2m_mean[i] || 0;
    const wind = data.daily.wind_speed_10m_max[i] || 0;

    if (tempMean !== null && tempMean !== undefined) md.tempSum += tempMean;
    if (tempMin !== null && tempMin !== undefined) md.tempMin = Math.min(md.tempMin, tempMin);
    if (tempMax !== null && tempMax !== undefined) md.tempMax = Math.max(md.tempMax, tempMax);
    md.precipSum += precip;
    md.humiditySum += humidity;
    md.windSum += wind;
    md.count += 1;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const records: ClimateRecord[] = [];
  let yearlyTempSum = 0;
  let yearlyPrecipSum = 0;
  let totalRecords = 0;

  for (let m = 0; m < 12; m++) {
    const md = monthlyData[m];
    if (md.count === 0) continue;
    const avgTemp = md.tempSum / md.count;
    records.push({
      month: monthNames[m],
      avgTemp: Math.round(avgTemp * 10) / 10,
      minTemp: Math.round((md.tempMin === Infinity ? 0 : md.tempMin) * 10) / 10,
      maxTemp: Math.round((md.tempMax === -Infinity ? 0 : md.tempMax) * 10) / 10,
      precipitation: Math.round((md.precipSum / (currentYear - startYear)) * 10) / 10,
      humidity: Math.round((md.humiditySum / md.count) * 10) / 10,
      windSpeed: Math.round((md.windSum / md.count) * 10) / 10,
    });
    yearlyTempSum += avgTemp;
    yearlyPrecipSum += md.precipSum / (currentYear - startYear);
    totalRecords += 1;
  }

  return {
    locationName: locationName || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
    latitude,
    longitude,
    records,
    yearlyAvgTemp: totalRecords > 0 ? Math.round((yearlyTempSum / totalRecords) * 10) / 10 : 0,
    yearlyTotalPrecipitation: Math.round(yearlyPrecipSum * 10) / 10,
  };
}

export function generateAlerts(weather: WeatherResponse): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const today = weather.daily[0];
  if (!today) return alerts;

  const now = new Date();
  const startTime = now.toISOString();
  const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  if (weather.current.uvIndex >= 8) {
    alerts.push({
      id: 'uv-' + now.getTime(),
      title: 'High UV Index Warning',
      description: `UV Index is ${weather.current.uvIndex}. Limit sun exposure, use sunscreen SPF 30+, and wear protective clothing.`,
      severity: weather.current.uvIndex >= 11 ? 'extreme' : 'severe',
      startTime, endTime,
      area: weather.current.locationName,
      eventType: 'UV Index',
    });
  }

  if (today.precipitationSum > 20 || today.precipitationProbability > 80) {
    const isHeavy = today.precipitationSum > 50;
    alerts.push({
      id: 'rain-' + now.getTime(),
      title: isHeavy ? 'Heavy Rainfall Alert' : 'Rainfall Expected',
      description: `${isHeavy ? 'Heavy' : 'Moderate'} rainfall expected today (${today.precipitationSum.toFixed(1)}mm). ${isHeavy ? 'Possible waterlogging in low-lying areas. Avoid travel if possible.' : 'Carry an umbrella and drive carefully.'}`,
      severity: isHeavy ? 'severe' : 'warning',
      startTime, endTime,
      area: weather.current.locationName,
      eventType: 'Rainfall',
    });
  }

  if (today.windSpeedMax > 40) {
    alerts.push({
      id: 'wind-' + now.getTime(),
      title: 'High Wind Speed Advisory',
      description: `Wind speeds up to ${today.windSpeedMax} km/h expected. Secure loose objects, avoid outdoor activities at heights, and drive with caution.`,
      severity: today.windSpeedMax > 60 ? 'severe' : 'warning',
      startTime, endTime,
      area: weather.current.locationName,
      eventType: 'Wind',
    });
  }

  if (today.weatherCode >= 95) {
    alerts.push({
      id: 'thunder-' + now.getTime(),
      title: 'Thunderstorm Warning',
      description: 'Thunderstorms expected today. Stay indoors, avoid open areas, and unplug sensitive electronic equipment.',
      severity: 'severe',
      startTime, endTime,
      area: weather.current.locationName,
      eventType: 'Thunderstorm',
    });
  }

  if (weather.current.temperature > 42) {
    alerts.push({
      id: 'heat-' + now.getTime(),
      title: 'Extreme Heat Warning',
      description: `Temperature is ${weather.current.temperature}°C. Risk of heatstroke. Stay hydrated, avoid going out between 11 AM – 4 PM, and check on elderly and children.`,
      severity: 'extreme',
      startTime, endTime,
      area: weather.current.locationName,
      eventType: 'Heat',
    });
  } else if (weather.current.temperature > 38) {
    alerts.push({
      id: 'heat-moderate-' + now.getTime(),
      title: 'Heat Advisory',
      description: `Temperature is ${weather.current.temperature}°C. Stay hydrated and limit outdoor activity during peak hours.`,
      severity: 'warning',
      startTime, endTime,
      area: weather.current.locationName,
      eventType: 'Heat',
    });
  }

  if (weather.current.temperature < 2) {
    alerts.push({
      id: 'cold-' + now.getTime(),
      title: 'Cold Weather Advisory',
      description: `Temperature is ${weather.current.temperature}°C. Dress warmly and protect crops from frost damage.`,
      severity: weather.current.temperature < 0 ? 'severe' : 'warning',
      startTime, endTime,
      area: weather.current.locationName,
      eventType: 'Cold',
    });
  }

  if (weather.current.visibility > 0 && weather.current.visibility < 1000) {
    alerts.push({
      id: 'vis-' + now.getTime(),
      title: 'Low Visibility Advisory',
      description: `Visibility is only ${weather.current.visibility}m. Drive slowly with headlights on, and avoid travel if possible.`,
      severity: 'warning',
      startTime, endTime,
      area: weather.current.locationName,
      eventType: 'Visibility',
    });
  }

  return alerts;
}

export function getAdvisory(weather: WeatherResponse): string {
  const today = weather.daily[0];
  const current = weather.current;
  let advisory = '';

  if (current.weatherCode >= 95) {
    advisory += 'Thunderstorms are forecast. If you are a farmer, protect harvested crops and delay spraying operations. ';
  } else if (today && today.precipitationProbability > 70) {
    advisory += 'Rain is likely today. Farmers should delay pesticide application and irrigation. ';
  } else if (current.uvIndex >= 8) {
    advisory += 'High UV levels — outdoor workers should use sun protection and stay hydrated. ';
  } else if (current.temperature > 40) {
    advisory += 'Heatwave conditions — irrigate crops in early morning or evening, mulch to retain soil moisture. ';
  } else if (current.temperature < 5) {
    advisory += 'Cold conditions — cover sensitive crops, use frost protection measures, and shelter livestock. ';
  } else if (current.windSpeed > 35) {
    advisory += 'Strong winds expected — secure farm equipment and delay spray operations. ';
  } else {
    advisory += 'Weather conditions are favorable for normal agricultural and outdoor activities. ';
  }

  if (today && today.uvIndexMax > 7) {
    advisory += `UV index peaks at ${today.uvIndexMax} around midday. `;
  }

  if (current.humidity > 80 && current.temperature > 25) {
    advisory += 'High humidity may increase risk of fungal diseases in crops. Monitor plants closely. ';
  }

  return advisory.trim();
}
