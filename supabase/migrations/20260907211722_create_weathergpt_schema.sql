/*
# WeatherGPT - Core Schema

## Overview
Creates the core schema for WeatherGPT, an AI-powered weather chatbot.
This is a single-tenant app (no auth) — chat history and preferences
are stored locally per device using an anonymous device_id.

## Tables

### chat_conversations
- Stores weather chat conversations (sessions of chat messages)
- `id` (uuid, primary key)
- `device_id` (text, identifies the device/user anonymously)
- `title` (text, conversation title derived from first message)
- `language` (text, language code like 'en', 'hi', 'ta')
- `created_at` (timestamptz)

### chat_messages
- Individual messages within a conversation
- `id` (uuid, primary key)
- `conversation_id` (uuid, FK to chat_conversations)
- `role` (text: 'user' or 'assistant')
- `content` (text, message content)
- `weather_data` (jsonb, optional weather snapshot associated with the message)
- `created_at` (timestamptz)

### saved_locations
- Locations saved by the user for quick access
- `id` (uuid, primary key)
- `device_id` (text)
- `name` (text, display name)
- `latitude` (double precision)
- `longitude` (double precision)
- `country` (text)
- `is_default` (boolean, default false)
- `created_at` (timestamptz)

### user_preferences
- Per-device preferences (language, temperature unit, etc.)
- `device_id` (text, primary key)
- `language` (text, default 'en')
- `unit` (text, default 'celsius' — celsius or fahrenheit)
- `voice_enabled` (boolean, default true)
- `auto_location` (boolean, default true)
- `theme` (text, default 'system')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Security
- RLS enabled on all tables
- Policies use `TO anon, authenticated` since this is a no-auth app
- Data is scoped by device_id passed from the client
*/

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  title text NOT NULL DEFAULT 'New Conversation',
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  weather_data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  country text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  device_id text PRIMARY KEY,
  language text NOT NULL DEFAULT 'en',
  unit text NOT NULL DEFAULT 'celsius' CHECK (unit IN ('celsius', 'fahrenheit')),
  voice_enabled boolean NOT NULL DEFAULT true,
  auto_location boolean NOT NULL DEFAULT true,
  theme text NOT NULL DEFAULT 'system' CHECK (theme IN ('system', 'light', 'dark')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_device ON chat_conversations(device_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_device ON saved_locations(device_id);

-- Enable RLS on all tables
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- chat_conversations policies
DROP POLICY IF EXISTS "anon_select_conversations" ON chat_conversations;
CREATE POLICY "anon_select_conversations" ON chat_conversations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_conversations" ON chat_conversations;
CREATE POLICY "anon_insert_conversations" ON chat_conversations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_conversations" ON chat_conversations;
CREATE POLICY "anon_update_conversations" ON chat_conversations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_conversations" ON chat_conversations;
CREATE POLICY "anon_delete_conversations" ON chat_conversations FOR DELETE TO anon, authenticated USING (true);

-- chat_messages policies
DROP POLICY IF EXISTS "anon_select_messages" ON chat_messages;
CREATE POLICY "anon_select_messages" ON chat_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_messages" ON chat_messages;
CREATE POLICY "anon_insert_messages" ON chat_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_messages" ON chat_messages;
CREATE POLICY "anon_update_messages" ON chat_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_messages" ON chat_messages;
CREATE POLICY "anon_delete_messages" ON chat_messages FOR DELETE TO anon, authenticated USING (true);

-- saved_locations policies
DROP POLICY IF EXISTS "anon_select_locations" ON saved_locations;
CREATE POLICY "anon_select_locations" ON saved_locations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_locations" ON saved_locations;
CREATE POLICY "anon_insert_locations" ON saved_locations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_locations" ON saved_locations;
CREATE POLICY "anon_update_locations" ON saved_locations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_locations" ON saved_locations;
CREATE POLICY "anon_delete_locations" ON saved_locations FOR DELETE TO anon, authenticated USING (true);

-- user_preferences policies
DROP POLICY IF EXISTS "anon_select_preferences" ON user_preferences;
CREATE POLICY "anon_select_preferences" ON user_preferences FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_preferences" ON user_preferences;
CREATE POLICY "anon_insert_preferences" ON user_preferences FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_preferences" ON user_preferences;
CREATE POLICY "anon_update_preferences" ON user_preferences FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_preferences" ON user_preferences;
CREATE POLICY "anon_delete_preferences" ON user_preferences FOR DELETE TO anon, authenticated USING (true);
