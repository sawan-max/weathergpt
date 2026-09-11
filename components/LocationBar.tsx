import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, ChevronDown, Search } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { SelectedLocation } from '@/lib/types';

interface LocationBarProps {
  location: SelectedLocation;
  onPress: () => void;
}

export function LocationBar({ location, onPress }: LocationBarProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <MapPin size={18} color={Colors.primary[600]} strokeWidth={2} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.cityText} numberOfLines={1}>
          {location.city}, {location.state}
        </Text>
        <Text style={styles.countryText} numberOfLines={1}>
          {location.country} · {location.timezone}
        </Text>
      </View>
      <View style={styles.actions}>
        <Search size={18} color={Colors.neutral[400]} strokeWidth={2} />
        <ChevronDown size={18} color={Colors.neutral[400]} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.neutral[0], borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: Colors.neutral[200], shadowColor: Colors.neutral[900], shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  containerPressed: { backgroundColor: Colors.neutral[50], borderColor: Colors.primary[200] },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary[50], justifyContent: 'center', alignItems: 'center' },
  textWrap: { flex: 1 },
  cityText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  countryText: { fontSize: 12, fontFamily: 'Inter-Regular', color: Colors.neutral[400], marginTop: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
