import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert, Mountain, CloudRain, Activity } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { SelectedLocation } from '@/lib/types';

interface RiskPanelProps {
  location: SelectedLocation;
}

export function RiskPanel({ location }: RiskPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ShieldAlert size={20} color={Colors.accent[600]} strokeWidth={2} />
        <Text style={styles.title}>Risk Assessment</Text>
      </View>

      <Text style={styles.subtitle}>
        Location: {location.city}, {location.state} ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
      </Text>

      <View style={styles.riskGrid}>
        <RiskItem
          icon={<Mountain size={18} color={Colors.neutral[500]} strokeWidth={2} />}
          label="Landslide Risk"
          value="Coming Soon"
        />
        <RiskItem
          icon={<CloudRain size={18} color={Colors.neutral[500]} strokeWidth={2} />}
          label="Flood Risk"
          value="Coming Soon"
        />
        <RiskItem
          icon={<Activity size={18} color={Colors.neutral[500]} strokeWidth={2} />}
          label="Cyclone Risk"
          value="Coming Soon"
        />
      </View>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Risk model integration coming soon. This panel will display landslide,
          flood, and cyclone risk assessments based on terrain data, rainfall,
          soil moisture, and weather forecasts for the selected location.
        </Text>
      </View>
    </View>
  );
}

function RiskItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.riskItem}>
      {icon}
      <View style={styles.riskItemText}>
        <Text style={styles.riskLabel}>{label}</Text>
        <Text style={styles.riskValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.neutral[0], borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.neutral[200], gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: Colors.neutral[500] },
  riskGrid: { flexDirection: 'row', gap: 12 },
  riskItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.neutral[50], borderRadius: 14, padding: 12, borderWidth: 1, borderColor: Colors.neutral[200] },
  riskItemText: { flex: 1 },
  riskLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: Colors.neutral[500], marginBottom: 2 },
  riskValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: Colors.neutral[400] },
  noticeBox: { backgroundColor: Colors.accent[50], borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.accent[200] },
  noticeText: { fontSize: 13, fontFamily: 'Inter-Regular', color: Colors.accent[700], lineHeight: 20 },
});
