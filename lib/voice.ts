import { Platform } from 'react-native';

export function isVoiceSupported(): boolean { if (Platform.OS !== 'web') return false; return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechRecognition' in window; }
export function getSpeechRecognition(): any { if (typeof window === 'undefined') return null; const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; return SR ? new SR() : null; }
export function speakText(text: string, lang: string = 'en-US'): void { if (Platform.OS !== 'web' || typeof window === 'undefined' || !('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = lang; utterance.rate = 0.95; utterance.pitch = 1; window.speechSynthesis.speak(utterance); }
export function stopSpeaking(): void { if (Platform.OS !== 'web' || typeof window === 'undefined' || !('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); }

const LANG_VOICE_MAP: Record<string, string> = { en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN', pa: 'pa-IN', kn: 'kn-IN', ml: 'ml-IN', es: 'es-ES', fr: 'fr-FR' };
export function getVoiceLang(lang: string): string { return LANG_VOICE_MAP[lang] || 'en-US'; }
