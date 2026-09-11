import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export const DEVICE_ID_KEY = 'weathergpt_device_id';

export function getDeviceId(): string {
  const existing = typeof window !== 'undefined' ? localStorage.getItem(DEVICE_ID_KEY) : null;
  if (existing) return existing;
  const newId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEVICE_ID_KEY, newId);
  }
  return newId;
}
