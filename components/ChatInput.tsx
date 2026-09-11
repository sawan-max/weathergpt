import { View, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Send, Mic, MicOff, Square } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { useState, useRef, useEffect } from 'react';
import { getSpeechRecognition, isVoiceSupported, speakText, stopSpeaking, getVoiceLang } from '@/lib/voice';
import { Language } from '@/lib/types';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  language: Language;
  voiceEnabled: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, language, voiceEnabled, placeholder }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const toggleListening = () => {
    if (!isVoiceSupported()) return;
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }
    stopSpeaking();
    const recognition = getSpeechRecognition();
    if (!recognition) return;
    recognition.lang = getVoiceLang(language);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const canVoice = voiceEnabled && isVoiceSupported();

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        {canVoice && (
          <Pressable style={[styles.micBtn, isListening && styles.micBtnActive]} onPress={toggleListening} disabled={disabled}>
            {isListening ? <Square size={20} color="#ffffff" strokeWidth={2} /> : <Mic size={20} color={Colors.neutral[500]} strokeWidth={2} />}
          </Pressable>
        )}
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={isListening ? 'Listening...' : (placeholder || 'Ask about weather...')}
          placeholderTextColor={Colors.neutral[400]}
          multiline
          maxLength={500}
          editable={!disabled}
          onSubmitEditing={handleSend}
        />
        <Pressable style={[styles.sendBtn, (!text.trim() || disabled) && styles.sendBtnDisabled]} onPress={handleSend} disabled={!text.trim() || disabled}>
          {disabled ? <ActivityIndicator size={20} color="#ffffff" /> : <Send size={20} color="#ffffff" strokeWidth={2} />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8, paddingHorizontal: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: Colors.neutral[0], borderRadius: 24, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: Colors.neutral[200], shadowColor: Colors.neutral[900], shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  micBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.neutral[100], justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  micBtnActive: { backgroundColor: Colors.error[500] },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular', color: Colors.neutral[800], maxHeight: 100, minHeight: 40, paddingHorizontal: 8, paddingVertical: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary[600], justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  sendBtnDisabled: { backgroundColor: Colors.neutral[300] },
});
