/*
# WeatherGPT - Missions & Plan Change Alerts

## Overview
Adds tables for storing user "missions" (planned activities with weather analysis),
plan change alerts, and plan alert preferences. This enables the Weather Mission Mode,
Backup Planner, Departure Checklist, and Plan Change Alert features.

## New Tables

### missions
- Stores user's planned activities with weather analysis results
- `id` (uuid, primary key)
- `device_id` (text, identifies device anonymously)
- `location` (jsonb, SelectedLocation object)
- `date` (text, planned date)
- `start_time` (text, start time)
- `end_time` (text, end time)
- `activity` (text, activity type)
- `transport_mode` (text, transport mode)
- `notes` (text, optional user notes)
- `status` (text: active, completed, archived)
- `mission_result` (jsonb, full mission analysis)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### plan_change_alerts
- Stores weather-driven alerts that affect active missions
- `id` (uuid, primary key)
- `mission_id` (uuid, FK to missions)
- `device_id` (text)
- `type` (text: rain_timing, rain_intensity, temperature, wind, visibility, severe_weather)
- `previous_forecast` (text)
- `latest_forecast` (text)
- `recommended_action` (text)
- `severity` (text: info, warning, severe)
- `dismissed` (boolean, default false)
- `created_at` (timestamptz)

### plan_alert_preferences
- Per-device configurable thresholds for plan change alerts
- `device_id` (text, primary key)
- `rain_timing_threshold` (int, minutes of timing shift to trigger alert)
- `rain_intensity_threshold` (numeric, mm change to trigger alert)
- `temperature_threshold` (int, degrees C change to trigger alert)
- `wind_threshold` (int, km/h change to trigger alert)
- `visibility_threshold` (int, meters change to trigger alert)
- `severe_weather_enabled` (boolean, default true)
- `alerts_enabled` (boolean, default true)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Security
- RLS enabled on all new tables
- Policies use TO anon, authenticated (no-auth app, data scoped by device_id)
- All CRUD operations allowed for anon + authenticated
*/

CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  location jsonb NOT NULL,
  date text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  activity text NOT NULL DEFAULT 'other',
  transport_mode text NOT NULL DEFAULT 'walking',
  notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  mission_result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plan_change_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('rain_timing', 'rain_intensity', 'temperature', 'wind', 'visibility', 'severe_weather')),
  previous_forecast text NOT NULL,
  latest_forecast text NOT NULL,
  recommended_action text NOT NULL,
  severity text NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'severe')),
  dismissed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plan_alert_preferences (
  device_id text PRIMARY KEY,
  rain_timing_threshold int NOT NULL DEFAULT 60,
  rain_intensity_threshold numeric NOT NULL DEFAULT 5.0,
  temperature_threshold int NOT NULL DEFAULT 5,
  wind_threshold int NOT NULL DEFAULT 15,
  visibility_threshold int NOT NULL DEFAULT 1000,
  severe_weather_enabled boolean NOT NULL DEFAULT true,
  alerts_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_missions_device ON missions(device_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_plan_alerts_mission ON plan_change_alerts(mission_id);
CREATE INDEX IF NOT EXISTS idx_plan_alerts_device ON plan_change_alerts(device_id);

-- Enable RLS
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_change_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_alert_preferences ENABLE ROW LEVEL SECURITY;

-- missions policies
DROP POLICY IF EXISTS "anon_select_missions" ON missions;
CREATE POLICY "anon_select_missions" ON missions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_missions" ON missions;
CREATE POLICY "anon_insert_missions" ON missions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_missions" ON missions;
CREATE POLICY "anon_update_missions" ON missions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_missions" ON missions;
CREATE POLICY "anon_delete_missions" ON missions FOR DELETE TO anon, authenticated USING (true);

-- plan_change_alerts policies
DROP POLICY IF EXISTS "anon_select_plan_alerts" ON plan_change_alerts;
CREATE POLICY "anon_select_plan_alerts" ON plan_change_alerts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_plan_alerts" ON plan_change_alerts;
CREATE POLICY "anon_insert_plan_alerts" ON plan_change_alerts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_plan_alerts" ON plan_change_alerts;
CREATE POLICY "anon_update_plan_alerts" ON plan_change_alerts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_plan_alerts" ON plan_change_alerts;
CREATE POLICY "anon_delete_plan_alerts" ON plan_change_alerts FOR DELETE TO anon, authenticated USING (true);

-- plan_alert_preferences policies
DROP POLICY IF EXISTS "anon_select_alert_prefs" ON plan_alert_preferences;
CREATE POLICY "anon_select_alert_prefs" ON plan_alert_preferences FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_alert_prefs" ON plan_alert_preferences;
CREATE POLICY "anon_insert_alert_prefs" ON plan_alert_preferences FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_alert_prefs" ON plan_alert_preferences;
CREATE POLICY "anon_update_alert_prefs" ON plan_alert_preferences FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_alert_prefs" ON plan_alert_preferences;
CREATE POLICY "anon_delete_alert_prefs" ON plan_alert_preferences FOR DELETE TO anon, authenticated USING (true);
