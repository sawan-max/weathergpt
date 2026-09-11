import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { BarChart3, RefreshCw, Navigation } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/languages';
import { ClimateData, SelectedLocation } from '@/lib/types';
import { getClimate } from '@/lib/weather';
import { ClimateChart } from '@/components/ClimateChart';
import { LocationSelector } from '@/components/LocationSelector';
import { LocationBar } from '@/components/LocationBar';

export default function ClimateScreen() {
  const { preferences, selectedLocation, selectLocation, detectLocation, detecting } = useApp();
  const lang = preferences?.language || 'en';
  const [climate, setClimate] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const fetchClimate = useCallback(async (loc: SelectedLocation) => {
    if (!loc) { setLoading(false); return; }
    setLoading(true); setError(null);
    try { const c = await getClimate(loc.latitude, loc.longitude, `${loc.city}, ${loc.state}, ${loc.country}`); setClimate(c); } catch (e) { setError('Climate data temporarily unavailable. Please try again.'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchClimate(selectedLocation); }, [selectedLocation.latitude, selectedLocation.longitude]);
  const handleRefresh = () => fetchClimate(selectedLocation);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View><Text style={styles.headerTitle}>{t('climate.title', lang)}</Text><Text style={styles.headerSub}>{t('climate.subtitle', lang)}</Text></View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn} onPress={handleRefresh} disabled={loading} hitSlop={8}><RefreshCw size={20} color={loading ? Colors.neutral[300] : Colors.neutral[600]} strokeWidth={2} /></Pressable>
            <Pressable style={styles.iconBtn} onPress={detectLocation} disabled={detecting} hitSlop={8}>{detecting ? <ActivityIndicator size={20} color={Colors.primary[500]} /> : <Navigation size={20} color={Colors.neutral[600]} strokeWidth={2} />}</Pressable>
          </View>
        </View>
        <LocationBar location={selectedLocation} onPress={() => setShowSelector(true)} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingWrap}><ActivityIndicator size={36} color={Colors.primary[500]} /><Text style={styles.loadingText}>Analyzing 10 years of climate data...</Text></View>
        ) : error ? (
          <View style={styles.errorWrap}><Text style={styles.errorText}>{error}</Text><Pressable style={styles.retryBtn} onPress={handleRefresh}><Text style={styles.retryText}>{t('common.retry', lang)}</Text></Pressable></View>
        ) : climate ? (
          <ClimateChart data={climate} />
        ) : (
          <View style={styles.emptyWrap}><BarChart3 size={48} color={Colors.neutral[300]} strokeWidth={1.5} /><Text style={styles.emptyText}>Search for a location to view climate analysis</Text><Pressable style={styles.searchBtn} onPress={() => setShowSelector(true)}><Text style={styles.searchBtnText}>Select Location</Text></Pressable></View>
        )}
      </ScrollView>
      <LocationSelector visible={showSelector} onClose={() => setShowSelector(false)} onSelect={selectLocation} onDetectLocation={detectLocation} detecting={detecting} currentLocation={selectedLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[50] },
  header: { backgroundColor: Colors.neutral[0], paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.neutral[200], gap: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: Colors.neutral[800] },
  headerSub: { fontSize: 13, fontFamily: 'Inter-Regular', color: Colors.neutral[500], marginTop: 2 },
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
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter-Regular', color: Colors.neutral[400], textAlign: 'center' },
  searchBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary[600], paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, marginTop: 8 },
  searchBtnText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: '#ffffff' },
});
