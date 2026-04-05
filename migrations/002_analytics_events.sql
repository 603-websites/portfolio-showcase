-- ============================================================
-- Analytics Events Table
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Events table for tracking page views, form submissions, etc.
CREATE TABLE IF NOT EXISTS analytics_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  event_type  text NOT NULL,         -- 'page_view', 'form_submission', 'conversion'
  event_name  text,                  -- optional label
  properties  jsonb,                 -- flexible: { page, referrer, title, formName, etc. }
  session_id  text,                  -- browser session identifier
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  event_date  date NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS analytics_events_client_date_idx
  ON analytics_events (client_id, event_date);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx
  ON analytics_events (event_type, created_at DESC);

-- RLS: no direct client access; ingestion goes through API route using admin client
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow devs to read all events
CREATE POLICY analytics_events_select_devs ON analytics_events
  FOR SELECT USING (public.is_dev());
