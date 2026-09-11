import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, Info, Zap, Clock } from 'lucide-react-native';
import { WeatherAlert } from '@/lib/types';
import { Colors, getSeverityColor, getSeverityBg } from '@/lib/theme';

interface AlertCardProps {
  alert: WeatherAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const sevColor = getSeverityColor(alert.severity);
  const sevBg = getSeverityBg(alert.severity);

  const getIcon = () => {
    if (alert.severity === 'extreme' || alert.severity === 'severe') return <Zap size={20} color={sevColor} strokeWidth={2} />;
    if (alert.severity === 'warning') return <AlertTriangle size={20} color={sevColor} strokeWidth={2} />;
    return <Info size={20} color={sevColor} strokeWidth={2} />;
  };

  const startTime = new Date(alert.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  const endTime = new Date(alert.endTime).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <View style={[styles.container, { borderLeftColor: sevColor, backgroundColor: sevBg }]}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>{getIcon()}</View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: sevColor }]}>{alert.title}</Text>
          <Text style={styles.area}>{alert.area} · {alert.eventType}</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: sevColor }]}>
          <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.description}>{alert.description}</Text>
      <View style={styles.timeRow}>
        <Clock size={14} color={Colors.neutral[500]} />
        <Text style={styles.timeText}>{startTime} — {endTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 16, padding: 16, borderLeftWidth: 4, borderWidth: 1, borderColor: Colors.neutral[200] },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  iconWrap: { marginTop: 2 },
  headerText: { flex: 1 },
  title: { fontSize: 16, fontFamily: 'Inter-SemiBold', marginBottom: 2 },
  area: { fontSize: 13, fontFamily: 'Inter-Regular', color: Colors.neutral[500] },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  severityText: { fontSize: 10, fontFamily: 'Inter-Bold', color: '#ffffff', letterSpacing: 0.5 },
  description: { fontSize: 14, fontFamily: 'Inter-Regular', color: Colors.neutral[700], lineHeight: 20, marginBottom: 10 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { fontSize: 12, fontFamily: 'Inter-Regular', color: Colors.neutral[500] },
});
