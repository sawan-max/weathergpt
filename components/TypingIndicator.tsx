import { View, Text, StyleSheet } from 'react-native';
import { Bot } from 'lucide-react-native';
import { Colors } from '@/lib/theme';

export function TypingIndicator() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Bot size={20} color={Colors.primary[600]} strokeWidth={2} />
        </View>
        <View style={styles.bubble}>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary[50], justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  bubble: { backgroundColor: Colors.neutral[100], borderRadius: 20, borderBottomLeftRadius: 6, paddingHorizontal: 20, paddingVertical: 16 },
  dotsRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.neutral[400] },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },
});
