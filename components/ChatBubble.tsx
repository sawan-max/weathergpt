import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Volume2, Bot, User } from 'lucide-react-native';
import { ChatMessage } from '@/lib/types';
import { Colors } from '@/lib/theme';
import { WeatherCard } from './WeatherCard';
import { AlertCard } from './AlertCard';
import { ClimateChart } from './ClimateChart';
import { WeatherResponse, WeatherAlert, ClimateData } from '@/lib/types';
import { speakText, stopSpeaking, getVoiceLang } from '@/lib/voice';
import { useState } from 'react';
import { Language } from '@/lib/types';

interface ChatBubbleProps {
  message: ChatMessage;
  language: Language;
  voiceEnabled: boolean;
}

export function ChatBubble({ message, language, voiceEnabled }: ChatBubbleProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.role === 'user';

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakText(message.content, getVoiceLang(language));
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), message.content.length * 60);
    }
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={styles.row}>
        {!isUser && (
          <View style={styles.avatar}>
            <Bot size={20} color={Colors.primary[600]} strokeWidth={2} />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
            {message.content}
          </Text>

          {!isUser && voiceEnabled && message.messageType !== 'error' && (
            <Pressable style={styles.speakBtn} onPress={handleSpeak} hitSlop={8}>
              <Volume2 size={16} color={isSpeaking ? Colors.primary[600] : Colors.neutral[400]} strokeWidth={2} />
            </Pressable>
          )}
        </View>
        {isUser && (
          <View style={[styles.avatar, styles.userAvatar]}>
            <User size={20} color="#ffffff" strokeWidth={2} />
          </View>
        )}
      </View>

      {!isUser && message.weatherData && message.messageType === 'weather' && (
        <View style={styles.cardWrap}>
          <WeatherCard weather={message.weatherData as WeatherResponse} compact={false} />
        </View>
      )}

      {!isUser && message.weatherData && message.messageType === 'forecast' && (
        <View style={styles.cardWrap}>
          <WeatherCard weather={message.weatherData as WeatherResponse} compact={false} />
        </View>
      )}

      {!isUser && message.weatherData && message.messageType === 'alert' && (
        <View style={styles.cardWrap}>
          {(message.weatherData as WeatherAlert[]).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </View>
      )}

      {!isUser && message.weatherData && message.messageType === 'climate' && (
        <View style={styles.cardWrap}>
          <ClimateChart data={message.weatherData as ClimateData} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  userContainer: { alignItems: 'flex-end' },
  assistantContainer: { alignItems: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary[50], justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  userAvatar: { backgroundColor: Colors.primary[600] },
  bubble: { maxWidth: '82%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  userBubble: { backgroundColor: Colors.primary[600], borderBottomRightRadius: 6 },
  assistantBubble: { backgroundColor: Colors.neutral[100], borderBottomLeftRadius: 6 },
  text: { fontSize: 15, fontFamily: 'Inter-Regular', lineHeight: 22 },
  userText: { color: '#ffffff' },
  assistantText: { color: Colors.neutral[800] },
  speakBtn: { marginTop: 8, alignSelf: 'flex-start' },
  cardWrap: { marginTop: 12, marginLeft: 44 },
});
