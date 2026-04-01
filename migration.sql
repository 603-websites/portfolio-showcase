-- ============================================================
-- Portfolio Showcase CMS Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add 'type' column to clients table
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'restaurant'
    CHECK (type IN ('restaurant', 'hvac'));

-- 2. Restaurant: announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  text        text NOT NULL DEFAULT '',
  active      boolean NOT NULL DEFAULT true,
  expires_at  date,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS announcements_client_idx ON announcements (client_id, sort_order);

-- 3. HVAC: services table
CREATE TABLE IF NOT EXISTS hvac_services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name          text NOT NULL DEFAULT '',
  description   text NOT NULL DEFAULT '',
  price_display text NOT NULL DEFAULT '',
  sort_order    int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE hvac_services ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS hvac_services_client_idx ON hvac_services (client_id, sort_order);

-- 4. HVAC: service areas table
CREATE TABLE IF NOT EXISTS hvac_service_areas (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  label      text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE hvac_service_areas ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS hvac_service_areas_client_idx ON hvac_service_areas (client_id, sort_order);

-- 5. HVAC: promotions table
CREATE TABLE IF NOT EXISTS hvac_promotions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title         text NOT NULL DEFAULT '',
  description   text NOT NULL DEFAULT '',
  discount_text text NOT NULL DEFAULT '',
  expires_at    date,
  active        boolean NOT NULL DEFAULT true,
  sort_order    int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE hvac_promotions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS hvac_promotions_client_idx ON hvac_promotions (client_id, sort_order);
