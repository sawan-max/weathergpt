import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, ShieldCheck, RefreshCw, Navigation } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/languages';
import { WeatherResponse, WeatherAlert, SelectedLocation } from '@/lib/types';
import { getWeather, generateAlerts } from '@/lib/weather';
import { AlertCard } from '@/components/AlertCard';
import { LocationSelector } from '@/components/LocationSelector';
import { LocationBar } from '@/components/LocationBar';

export default function AlertsScreen() {
  const { preferences, selectedLocation, selectLocation, detectLocation, detecting } = useApp();
  const lang = preferences?.language || 'en';
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const fetchAlerts = useCallback(async (loc: SelectedLocation) => {
    if (!loc) { setLoading(false); return; }
    setLoading(true); setError(null);
    try { const w = await getWeather(loc.latitude, loc.longitude, `${loc.city}, ${loc.state}, ${loc.country}`); setAlerts(generateAlerts(w)); } catch (e) { setError('Weather data temporarily unavailable. Please try again.'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAlerts(selectedLocation); }, [selectedLocation.latitude, selectedLocation.longitude]);
  const handleRefresh = () => fetchAlerts(selectedLocation);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View><Text style={styles.headerTitle}>{t('alerts.title', lang)}</Text></View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn} onPress={handleRefresh} disabled={loading} hitSlop={8}><RefreshCw size={20} color={loading ? Colors.neutral[300] : Colors.neutral[600]} strokeWidth={2} /></Pressable>
            <Pressable style={styles.iconBtn} onPress={detectLocation} disabled={detecting} hitSlop={8}>{detecting ? <ActivityIndicator size={20} color={Colors.primary[500]} /> : <Navigation size={20} color={Colors.neutral[600]} strokeWidth={2} />}</Pressable>
          </View>
        </View>
        <LocationBar location={selectedLocation} onPress={() => setShowSelector(true)} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingWrap}><ActivityIndicator size={36} color={Colors.primary[500]} /><Text style={styles.loadingText}>Checking for alerts...</Text></View>
        ) : error ? (
          <View style={styles.errorWrap}><Text style={styles.errorText}>{error}</Text><Pressable style={styles.retryBtn} onPress={handleRefresh}><Text style={styles.retryText}>{t('common.retry', lang)}</Text></Pressable></View>
        ) : alerts.length > 0 ? (
          <View style={styles.alertsList}>
            <View style={styles.alertBanner}><AlertTriangle size={20} color={Colors.warning[600]} strokeWidth={2} /><Text style={styles.alertBannerText}>{alerts.length} active {alerts.length === 1 ? 'alert' : 'alerts'} for {selectedLocation.city}, {selectedLocation.state}</Text></View>
            {alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
          </View>
        ) : (
          <View style={styles.safeWrap}><View style={styles.safeIconWrap}><ShieldCheck size={56} color={Colors.success[500]} strokeWidth={1.5} /></View><Text style={styles.safeTitle}>All Clear</Text><Text style={styles.safeText}>{t('alerts.none', lang)}</Text><Text style={styles.safeLoc}>{selectedLocation.city}, {selectedLocation.state}, {selectedLocation.country}</Text></View>
        )}
      </ScrollView>
      <LocationSelector visible={showSelector} onClose={() => setShowSelector(false)} onSelect={selectLocation} onDetectLocation={detectLocation} detecting={detecting} currentLocation={selectedLocation} />
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
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  loadingText: { fontSize: 14, fontFamily: 'Inter-Regular', color: Colors.neutral[400], marginTop: 12 },
  errorWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  errorText: { fontSize: 15, fontFamily: 'Inter-Regular', color: Colors.error[500], textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: Colors.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
  retryText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: '#ffffff' },
  alertsList: { gap: 12 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.warning[50], borderWidth: 1, borderColor: Colors.warning[200], borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  alertBannerText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: Colors.warning[700], flex: 1 },
  safeWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 12 },
  safeIconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.success[50], justifyContent: 'center', alignItems: 'center' },
  safeTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: Colors.success[700] },
  safeText: { fontSize: 15, fontFamily: 'Inter-Regular', color: Colors.neutral[500], textAlign: 'center', paddingHorizontal: 32 },
  safeLoc: { fontSize: 13, fontFamily: 'Inter-Regular', color: Colors.neutral[400] },
});
