import { supabase, getDeviceId } from './supabase';
import { ChatMessage, Conversation, SavedLocation, UserPreferences, Language, Mission, MissionResult, ActivityType, TransportMode, SelectedLocation } from './types';

export async function createConversation(title: string, language: Language): Promise<Conversation | null> {
  const deviceId = getDeviceId();
  const { data, error } = await supabase.from('chat_conversations').insert({ device_id: deviceId, title, language }).select().single();
  if (error) return null;
  return { id: data.id, title: data.title, language: data.language, createdAt: data.created_at };
}

export async function getConversations(): Promise<Conversation[]> {
  const deviceId = getDeviceId();
  const { data, error } = await supabase.from('chat_conversations').select('*').eq('device_id', deviceId).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((r: any) => ({ id: r.id, title: r.title, language: r.language, createdAt: r.created_at }));
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase.from('chat_messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map((r: any) => ({ id: r.id, conversationId: r.conversation_id, role: r.role, content: r.content, weatherData: r.weather_data, messageType: 'text' as const, createdAt: r.created_at }));
}

export async function saveMessage(conversationId: string, role: 'user' | 'assistant', content: string, weatherData?: any, messageType: string = 'text'): Promise<ChatMessage | null> {
  const { data, error } = await supabase.from('chat_messages').insert({ conversation_id: conversationId, role, content, weather_data: weatherData || null }).select().single();
  if (error) return null;
  return { id: data.id, conversationId: data.conversation_id, role: data.role, content: data.content, weatherData: data.weather_data, messageType: messageType as any, createdAt: data.created_at };
}

export async function deleteConversation(conversationId: string): Promise<boolean> { const { error } = await supabase.from('chat_conversations').delete().eq('id', conversationId); return !error; }

export async function getSavedLocations(): Promise<SavedLocation[]> {
  const deviceId = getDeviceId();
  const { data, error } = await supabase.from('saved_locations').select('*').eq('device_id', deviceId).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((r: any) => ({ id: r.id, name: r.name, latitude: r.latitude, longitude: r.longitude, country: r.country, isDefault: r.is_default, createdAt: r.created_at }));
}

export async function saveLocation(name: string, latitude: number, longitude: number, country?: string, isDefault: boolean = false): Promise<SavedLocation | null> {
  const deviceId = getDeviceId();
  if (isDefault) { await supabase.from('saved_locations').update({ is_default: false }).eq('device_id', deviceId).eq('is_default', true); }
  const { data, error } = await supabase.from('saved_locations').insert({ device_id: deviceId, name, latitude, longitude, country, is_default: isDefault }).select().single();
  if (error) return null;
  return { id: data.id, name: data.name, latitude: data.latitude, longitude: data.longitude, country: data.country, isDefault: data.is_default, createdAt: data.created_at };
}

export async function deleteLocation(id: string): Promise<boolean> { const { error } = await supabase.from('saved_locations').delete().eq('id', id); return !error; }

export async function setDefaultLocation(id: string): Promise<boolean> {
  const deviceId = getDeviceId();
  await supabase.from('saved_locations').update({ is_default: false }).eq('device_id', deviceId).eq('is_default', true);
  const { error } = await supabase.from('saved_locations').update({ is_default: true }).eq('id', id); return !error;
}

export async function getPreferences(): Promise<UserPreferences | null> {
  const deviceId = getDeviceId();
  const { data, error } = await supabase.from('user_preferences').select('*').eq('device_id', deviceId).maybeSingle();
  if (error || !data) {
    const defaultPrefs: UserPreferences = { deviceId, language: 'en', unit: 'celsius', voiceEnabled: true, autoLocation: true, theme: 'system' };
    await supabase.from('user_preferences').insert({ device_id: deviceId, language: defaultPrefs.language, unit: defaultPrefs.unit, voice_enabled: defaultPrefs.voiceEnabled, auto_location: defaultPrefs.autoLocation, theme: defaultPrefs.theme });
    return defaultPrefs;
  }
  return { deviceId: data.device_id, language: data.language, unit: data.unit, voiceEnabled: data.voice_enabled, autoLocation: data.auto_location, theme: data.theme };
}

export async function updatePreferences(prefs: Partial<UserPreferences>): Promise<boolean> {
  const deviceId = getDeviceId();
  const update: any = { updated_at: new Date().toISOString() };
  if (prefs.language) update.language = prefs.language;
  if (prefs.unit) update.unit = prefs.unit;
  if (prefs.voiceEnabled !== undefined) update.voice_enabled = prefs.voiceEnabled;
  if (prefs.autoLocation !== undefined) update.auto_location = prefs.autoLocation;
  if (prefs.theme) update.theme = prefs.theme;
  const { error } = await supabase.from('user_preferences').update(update).eq('device_id', deviceId); return !error;
}

export async function createMission(location: SelectedLocation, date: string, startTime: string, endTime: string, activity: ActivityType, transportMode: TransportMode, notes?: string, missionResult?: MissionResult): Promise<Mission | null> {
  const deviceId = getDeviceId();
  const { data, error } = await supabase.from('missions').insert({ device_id: deviceId, location, date, start_time: startTime, end_time: endTime, activity, transport_mode: transportMode, notes: notes || null, status: 'active', mission_result: missionResult || null }).select().single();
  if (error) return null; return mapMission(data);
}

export async function getMissions(): Promise<Mission[]> {
  const deviceId = getDeviceId();
  const { data, error } = await supabase.from('missions').select('*').eq('device_id', deviceId).order('created_at', { ascending: false });
  if (error || !data) return []; return data.map(mapMission);
}

export async function getActiveMissions(): Promise<Mission[]> {
  const deviceId = getDeviceId();
  const { data, error } = await supabase.from('missions').select('*').eq('device_id', deviceId).eq('status', 'active').order('created_at', { ascending: false });
  if (error || !data) return []; return data.map(mapMission);
}

export async function updateMission(id: string, updates: Partial<Mission>): Promise<boolean> {
  const update: any = { updated_at: new Date().toISOString() };
  if (updates.location) update.location = updates.location;
  if (updates.date) update.date = updates.date;
  if (updates.startTime) update.start_time = updates.startTime;
  if (updates.endTime) update.end_time = updates.endTime;
  if (updates.activity) update.activity = updates.activity;
  if (updates.transportMode) update.transport_mode = updates.transportMode;
  if (updates.notes !== undefined) update.notes = updates.notes;
  if (updates.status) update.status = updates.status;
  if (updates.missionResult) update.mission_result = updates.missionResult;
  const { error } = await supabase.from('missions').update(update).eq('id', id); return !error;
}

export async function deleteMission(id: string): Promise<boolean> { const { error } = await supabase.from('missions').delete().eq('id', id); return !error; }

export async function duplicateMission(id: string): Promise<Mission | null> {
  const { data, error } = await supabase.from('missions').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  const deviceId = getDeviceId();
  const { data: newData, error: insertError } = await supabase.from('missions').insert({ device_id: deviceId, location: data.location, date: data.date, start_time: data.start_time, end_time: data.end_time, activity: data.activity, transport_mode: data.transport_mode, notes: data.notes, status: 'active', mission_result: data.mission_result }).select().single();
  if (insertError || !newData) return null; return mapMission(newData);
}

function mapMission(r: any): Mission {
  return { id: r.id, deviceId: r.device_id, location: r.location, date: r.date, startTime: r.start_time, endTime: r.end_time, activity: r.activity as ActivityType, transportMode: r.transport_mode as TransportMode, notes: r.notes, status: r.status, missionResult: r.mission_result, createdAt: r.created_at, updatedAt: r.updated_at };
}
