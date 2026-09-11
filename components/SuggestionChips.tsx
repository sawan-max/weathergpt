import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { Language } from '@/lib/types';
import { SUGGESTION_QUERIES } from '@/lib/weatherEngine';
import { t } from '@/lib/languages';

interface SuggestionChipsProps {
  language: Language;
  onSelect: (query: string) => void;
}

export function SuggestionChips({ language, onSelect }: SuggestionChipsProps) {
  const suggestions = SUGGESTION_QUERIES[language] || SUGGESTION_QUERIES.en;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Sparkles size={16} color={Colors.primary[500]} strokeWidth={2} />
        <Text style={styles.header}>{t('chat.suggestions', language)}</Text>
      </View>
      <View style={styles.chipsRow}>
        {suggestions.map((q, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            onPress={() => onSelect(q)}
          >
            <Text style={styles.chipText}>{q}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  header: { fontSize: 13, fontFamily: 'Inter-Medium', color: Colors.neutral[500] },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: Colors.primary[50], borderWidth: 1, borderColor: Colors.primary[200], paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipPressed: { backgroundColor: Colors.primary[100] },
  chipText: { fontSize: 13, fontFamily: 'Inter-Medium', color: Colors.primary[700] },
});
