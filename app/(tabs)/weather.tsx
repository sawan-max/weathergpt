import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { RefreshCw, Navigation } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/languages';
import { WeatherResponse, SelectedLocation } from '@/lib/types';
import { getWeather } from '@/lib/weather';
import { WeatherCard } from '@/components/WeatherCard';
import { LocationSelector } from '@/components/LocationSelector';
import { LocationBar } from '@/components/LocationBar';
import { NearbyLocations } from '@/components/NearbyLocations';
import { RiskPanel } from '@/components/RiskPanel';
import { saveLocation as saveLocationDb } from '@/lib/storage';

export default function WeatherScreen() {
  const { preferences, selectedLocation, selectLocation, detectLocation, detecting } = useApp();
  const lang = preferences?.language || 'en';
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const fetchWeather = useCallback(async (loc: SelectedLocation) => {
    if (!loc) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const w = await getWeather(loc.latitude, loc.longitude, `${loc.city}, ${loc.state}, ${loc.country}`);
      setWeather(w);
    } catch (e) {
      setError('Weather data temporarily unavailable. Please try again.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchWeather(selectedLocation); }, [selectedLocation.latitude, selectedLocation.longitude]);

  const handleSelectLocation = async (loc: SelectedLocation) => {
    selectLocation(loc);
    saveLocationDb(loc.city, loc.latitude, loc.longitude, loc.country, false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View><Text style={styles.headerTitle}>{t('weather.current', lang)}</Text></View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn} onPress={() => fetchWeather(selectedLocation)} disabled={loading} hitSlop={8}>
              <RefreshCw size={20} color={loading ? Colors.neutral[300] : Colors.neutral[600]} strokeWidth={2} />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={detectLocation} disabled={detecting} hitSlop={8}>
              {detecting ? <ActivityIndicator size={20} color={Colors.primary[500]} /> : <Navigation size={20} color={Colors.neutral[600]} strokeWidth={2} />}
            </Pressable>
          </View>
        </View>
        <LocationBar location={selectedLocation} onPress={() => setShowSelector(true)} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingWrap}><ActivityIndicator size={36} color={Colors.primary[500]} /><Text style={styles.loadingText}>Loading weather data...</Text></View>
        ) : error ? (
          <View style={styles.errorWrap}><Text style={styles.errorText}>{error}</Text><Pressable style={styles.retryBtn} onPress={() => fetchWeather(selectedLocation)}><Text style={styles.retryText}>{t('common.retry', lang)}</Text></Pressable></View>
        ) : weather ? (
          <View style={styles.contentGap}><WeatherCard weather={weather} /><NearbyLocations currentLocation={selectedLocation} onSelect={handleSelectLocation} /><RiskPanel location={selectedLocation} /></View>
        ) : null}
      </ScrollView>
      <LocationSelector visible={showSelector} onClose={() => setShowSelector(false)} onSelect={handleSelectLocation} onDetectLocation={detectLocation} detecting={detecting} currentLocation={selectedLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[50] },
  header: { backgroundColor: Colors.neutral[0], paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.neutral[200], gap: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: Colors.neutral[800] },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.neutral[100], justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  contentGap: { gap: 16 },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  loadingText: { fontSize: 14, fontFamily: 'Inter-Regular', color: Colors.neutral[400], marginTop: 12 },
  errorWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  errorText: { fontSize: 15, fontFamily: 'Inter-Regular', color: Colors.error[500], textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: Colors.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
  retryText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: '#ffffff' },
});
