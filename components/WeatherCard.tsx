import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplets, Wind, Gauge, Eye, Sun as SunIcon, Sunrise, Sunset, CloudRain } from 'lucide-react-native';
import { CurrentWeather, HourlyForecast, DailyForecast, WeatherResponse } from '@/lib/types';
import { Colors, getWeatherGradient, getUVLevel } from '@/lib/theme';
import { WeatherIcon } from './WeatherIcon';

const { width: screenWidth } = Dimensions.get('window');

interface WeatherCardProps { weather: WeatherResponse; compact?: boolean; }

export function WeatherCard({ weather, compact = false }: WeatherCardProps) {
  const c = weather.current;
  const [gradFrom, gradTo] = getWeatherGradient(c.weatherCode, c.isDay);
  return (
    <View style={styles.container}>
      <LinearGradient colors={[gradFrom, gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroLeft}>
            <Text style={styles.locationName}>{c.locationName}</Text>
            <Text style={styles.heroTemp}>{c.temperature}°C</Text>
            <Text style={styles.heroDesc}>{c.description}</Text>
            <Text style={styles.heroFeels}>Feels like {c.feelsLike}°C</Text>
          </View>
          <View style={styles.heroRight}><WeatherIcon icon={c.icon} size={72} color="#ffffff" isDay={c.isDay} /></View>
        </View>
        {!compact && (
          <View style={styles.metricsRow}>
            <MetricChip icon={<Droplets size={16} color="#ffffff" />} label={`${c.humidity}%`} />
            <MetricChip icon={<Wind size={16} color="#ffffff" />} label={`${c.windSpeed} km/h`} />
            <MetricChip icon={<Gauge size={16} color="#ffffff" />} label={`${c.pressure} hPa`} />
            <MetricChip icon={<Eye size={16} color="#ffffff" />} label={c.visibility > 0 ? `${(c.visibility / 1000).toFixed(1)} km` : 'N/A'} />
          </View>
        )}
      </LinearGradient>
      {!compact && (
        <View style={styles.detailsGrid}>
          <DetailTile icon={<SunIcon size={20} color={Colors.accent[500]} />} label="UV Index" value={`${c.uvIndex} · ${getUVLevel(c.uvIndex).label}`} color={getUVLevel(c.uvIndex).color} />
          <DetailTile icon={<Droplets size={20} color={Colors.secondary[500]} />} label="Humidity" value={`${c.humidity}%`} />
          <DetailTile icon={<Wind size={20} color={Colors.neutral[500]} />} label="Wind" value={`${c.windSpeed} km/h`} />
          <DetailTile icon={<Gauge size={20} color={Colors.neutral[600]} />} label="Pressure" value={`${c.pressure} hPa`} />
          {weather.daily[0] && (<>
            <DetailTile icon={<Sunrise size={20} color={Colors.warning[500]} />} label="Sunrise" value={new Date(weather.daily[0].sunrise).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} />
            <DetailTile icon={<Sunset size={20} color={Colors.accent[600]} />} label="Sunset" value={new Date(weather.daily[0].sunset).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} />
          </>)}
        </View>
      )}
      {!compact && weather.hourly.length > 0 && (
        <View style={styles.section}><Text style={styles.sectionTitle}>Next 24 Hours</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>{weather.hourly.map((h, i) => <HourlyItem key={i} hour={h} />)}</ScrollView></View>
      )}
      {!compact && weather.daily.length > 0 && (
        <View style={styles.section}><Text style={styles.sectionTitle}>7-Day Forecast</Text>{weather.daily.map((d, i) => <DailyItem key={i} day={d} isToday={i === 0} />)}</View>
      )}
    </View>
  );
}

function MetricChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <View style={styles.metricChip}>{icon}<Text style={styles.metricChipText}>{label}</Text></View>;
}

function DetailTile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return <View style={styles.detailTile}><View style={styles.detailIconRow}>{icon}</View><Text style={styles.detailLabel}>{label}</Text><Text style={[styles.detailValue, color ? { color } : undefined]}>{value}</Text></View>;
}

function HourlyItem({ hour }: { hour: HourlyForecast }) {
  const time = new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  return <View style={styles.hourlyItem}><Text style={styles.hourlyTime}>{time}</Text><WeatherIcon icon={hour.icon} size={28} color={Colors.neutral[700]} /><Text style={styles.hourlyTemp}>{hour.temperature}°</Text><View style={styles.hourlyPrecip}><CloudRain size={12} color={Colors.secondary[500]} /><Text style={styles.hourlyPrecipText}>{hour.precipitationProbability}%</Text></View></View>;
}

function DailyItem({ day, isToday }: { day: DailyForecast; isToday: boolean }) {
  const dateLabel = isToday ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
  return <View style={styles.dailyItem}><Text style={[styles.dailyDay, isToday && styles.dailyToday]}>{dateLabel}</Text><WeatherIcon icon={day.icon} size={28} color={Colors.neutral[700]} /><Text style={styles.dailyDesc}>{day.description}</Text><View style={styles.dailyPrecipRow}><CloudRain size={14} color={Colors.secondary[500]} /><Text style={styles.dailyPrecip}>{day.precipitationProbability}%</Text></View><View style={styles.dailyTempRow}><Text style={styles.dailyTempMin}>{day.tempMin}°</Text><View style={styles.dailyTempBar}><View style={[styles.dailyTempFill, { left: `${Math.max(0, Math.min(100, ((day.tempMin + 10) / 50) * 100))}%`, right: `${Math.max(0, Math.min(100, 100 - ((day.tempMax + 10) / 50) * 100))}%` }]} /></View><Text style={styles.dailyTempMax}>{day.tempMax}°</Text></View></View>;
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  heroCard: { borderRadius: 24, padding: 24, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLeft: { flex: 1 },
  heroRight: { paddingLeft: 12 },
  locationName: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#ffffff', marginBottom: 8 },
  heroTemp: { fontSize: 56, fontFamily: 'Inter-Bold', color: '#ffffff', lineHeight: 64 },
  heroDesc: { fontSize: 18, fontFamily: 'Inter-Medium', color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  heroFeels: { fontSize: 14, fontFamily: 'Inter-Regular', color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 },
  metricChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  metricChipText: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#ffffff' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  detailTile: { flex: 1, minWidth: (screenWidth - 48) / 2 - 6, backgroundColor: Colors.neutral[50], borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.neutral[200] },
  detailIconRow: { marginBottom: 8 },
  detailLabel: { fontSize: 13, fontFamily: 'Inter-Regular', color: Colors.neutral[500], marginBottom: 4 },
  detailValue: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  hourlyScroll: { flexDirection: 'row' },
  hourlyItem: { alignItems: 'center', gap: 6, marginRight: 16, minWidth: 56 },
  hourlyTime: { fontSize: 12, fontFamily: 'Inter-Regular', color: Colors.neutral[500] },
  hourlyTemp: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  hourlyPrecip: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  hourlyPrecipText: { fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.secondary[600] },
  dailyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.neutral[100] },
  dailyDay: { fontSize: 15, fontFamily: 'Inter-Medium', color: Colors.neutral[700], width: 56 },
  dailyToday: { color: Colors.primary[600], fontFamily: 'Inter-SemiBold' },
  dailyDesc: { flex: 1, fontSize: 14, fontFamily: 'Inter-Regular', color: Colors.neutral[600] },
  dailyPrecipRow: { flexDirection: 'row', alignItems: 'center', gap: 3, width: 48 },
  dailyPrecip: { fontSize: 12, fontFamily: 'Inter-Regular', color: Colors.secondary[600] },
  dailyTempRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 100 },
  dailyTempMin: { fontSize: 14, fontFamily: 'Inter-Regular', color: Colors.neutral[400], width: 32 },
  dailyTempBar: { flex: 1, height: 6, backgroundColor: Colors.neutral[200], borderRadius: 3, position: 'relative' },
  dailyTempFill: { position: 'absolute', top: 0, bottom: 0, backgroundColor: Colors.primary[400], borderRadius: 3 },
  dailyTempMax: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800], width: 32, textAlign: 'right' },
});
