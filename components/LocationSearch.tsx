import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Search, MapPin, X, Plus, Star } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { Colors } from '@/lib/theme';
import { searchLocations } from '@/lib/weather';

interface LocationSearchProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (lat: number, lon: number, name: string, country: string) => void;
}

export function LocationSearch({ visible, onClose, onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try { const res = await searchLocations(text); setResults(res); } catch { setResults([]); }
    setLoading(false);
  }, []);

  const handleSelect = (r: any) => {
    const name = r.admin1 ? `${r.name}, ${r.admin1}, ${r.country}` : `${r.name}, ${r.country}`;
    onSelect(r.latitude, r.longitude, name, r.country);
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Search Location</Text>
            <Pressable onPress={onClose} hitSlop={12}><X size={24} color={Colors.neutral[600]} strokeWidth={2} /></Pressable>
          </View>
          <View style={styles.searchRow}>
            <Search size={20} color={Colors.neutral[400]} strokeWidth={2} />
            <TextInput style={styles.input} placeholder="Enter city name..." placeholderTextColor={Colors.neutral[400]} value={query} onChangeText={handleSearch} autoFocus />
            {loading && <ActivityIndicator size={20} color={Colors.primary[500]} />}
          </View>
          <ScrollView style={styles.results} keyboardShouldPersistTaps="handled">
            {results.map((r, i) => (
              <Pressable key={`${r.latitude}-${r.longitude}-${i}`} style={({ pressed }) => [styles.resultItem, pressed && styles.resultItemPressed]} onPress={() => handleSelect(r)}>
                <MapPin size={20} color={Colors.primary[500]} strokeWidth={2} />
                <View style={styles.resultText}>
                  <Text style={styles.resultName}>{r.name}</Text>
                  <Text style={styles.resultRegion}>{[r.admin1, r.country].filter(Boolean).join(', ')}</Text>
                </View>
              </Pressable>
            ))}
            {!loading && query.length >= 2 && results.length === 0 && (
              <Text style={styles.noResults}>No locations found. Try a different name.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.neutral[0], borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 32, maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 20, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.neutral[100], borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter-Regular', color: Colors.neutral[800] },
  results: { paddingHorizontal: 20 },
  resultItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.neutral[100] },
  resultItemPressed: { backgroundColor: Colors.neutral[50] },
  resultText: { flex: 1 },
  resultName: { fontSize: 16, fontFamily: 'Inter-Medium', color: Colors.neutral[800] },
  resultRegion: { fontSize: 13, fontFamily: 'Inter-Regular', color: Colors.neutral[500], marginTop: 2 },
  noResults: { fontSize: 14, fontFamily: 'Inter-Regular', color: Colors.neutral[400], textAlign: 'center', paddingVertical: 20 },
});
