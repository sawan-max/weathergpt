import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MapPin, ChevronRight, X } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { SelectedLocation } from '@/lib/types';
import { getNearbyCuratedLocations } from '@/lib/indianLocations';
import { useMemo } from 'react';

interface NearbyLocationsProps {
  currentLocation: SelectedLocation;
  onSelect: (loc: SelectedLocation) => void;
}

export function NearbyLocations({ currentLocation, onSelect }: NearbyLocationsProps) {
  const nearby = useMemo(
    () => getNearbyCuratedLocations(currentLocation.latitude, currentLocation.longitude, currentLocation.city, 6),
    [currentLocation.latitude, currentLocation.longitude, currentLocation.city]
  );

  if (nearby.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Locations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {nearby.map((loc, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            onPress={() => onSelect(loc)}
          >
            <MapPin size={14} color={Colors.primary[500]} strokeWidth={2} />
            <View style={styles.chipText}>
              <Text style={styles.chipCity} numberOfLines={1}>{loc.city}</Text>
              <Text style={styles.chipState} numberOfLines={1}>{loc.state}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  title: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: Colors.neutral[700] },
  scroll: { flexDirection: 'row' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.neutral[0], borderWidth: 1, borderColor: Colors.neutral[200], borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, minWidth: 120 },
  chipPressed: { backgroundColor: Colors.primary[50], borderColor: Colors.primary[200] },
  chipText: { flex: 1 },
  chipCity: { fontSize: 14, fontFamily: 'Inter-Medium', color: Colors.neutral[800] },
  chipState: { fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.neutral[400], marginTop: 1 },
});
