-- ============================================
-- EuroCarz — Supabase Database Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard > SQL Editor
-- ============================================

-- ────────────────────────────────────────────
-- TABLE: cars
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  color           TEXT,
  fuel            TEXT NOT NULL CHECK (fuel IN ('petrol', 'diesel', 'electric', 'hybrid')),
  transmission    TEXT NOT NULL CHECK (transmission IN ('automatic', 'manual')),
  seats           INT NOT NULL DEFAULT 5,
  price_day       INT NOT NULL,
  price_12hr      INT NOT NULL,
  price_6hr       INT NOT NULL,
  cities          TEXT[] NOT NULL DEFAULT ARRAY['Jalandhar', 'Phagwara'],
  image_url       TEXT,
  rating          NUMERIC(2,1) DEFAULT 4.5,
  review_count    INT DEFAULT 0,
  km_per_day      INT DEFAULT 300,
  features        JSONB DEFAULT '[]',
  badge           TEXT,
  available       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- TABLE: bookings
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id              SERIAL PRIMARY KEY,
  car_id          INT REFERENCES cars(id) ON DELETE SET NULL,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  pickup_date     DATE NOT NULL,
  pickup_time     TEXT,
  dropoff_date    DATE,
  duration        TEXT NOT NULL DEFAULT 'day' CHECK (duration IN ('6hr', '12hr', 'day')),
  duration_label  TEXT,
  city            TEXT NOT NULL,
  units           INT NOT NULL DEFAULT 1,
  total_price     INT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- TABLE: host_listings
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS host_listings (
  id              SERIAL PRIMARY KEY,
  car_make        TEXT NOT NULL,
  car_model       TEXT NOT NULL,
  car_year        INT,
  fuel            TEXT,
  transmission    TEXT,
  seats           INT,
  price_per_day   INT,
  km_per_day      INT,
  cities          TEXT[],
  description     TEXT,
  features        TEXT,
  host_name       TEXT NOT NULL,
  host_email      TEXT NOT NULL,
  host_phone      TEXT NOT NULL,
  aadhaar_pan     TEXT,
  bank_account    TEXT,
  ifsc_code       TEXT,
  status          TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- SEED: Insert the 6 EuroCarz cars
-- ────────────────────────────────────────────
INSERT INTO cars (name, color, fuel, transmission, seats, price_day, price_12hr, price_6hr, cities, image_url, rating, review_count, km_per_day, features, badge, available)
VALUES
  (
    'Mahindra Roxx', 'Glossy Black',
    'diesel', 'manual', 7, 3500, 2200, 1200,
    ARRAY['Jalandhar', 'Phagwara'],
    'images/roxx.jpg', 4.8, 24, 300,
    '["7 Seater", "Panoramic sunroof", "ADAS safety suite", "Wireless Apple CarPlay", "6 airbags", "360° camera"]',
    'New', TRUE
  ),
  (
    'Mahindra XUV 7XO', 'Champagne Gold',
    'petrol', 'automatic', 7, 4500, 2500, 1500,
    ARRAY['Jalandhar', 'Phagwara'],
    'images/xuv7xo.jpg', 4.9, 18, 300,
    '["7 Seater", "Level 2 ADAS", "12.3\" dual screens", "Harman Kardon audio", "Panoramic sunroof", "Ventilated seats"]',
    'Premium', TRUE
  ),
  (
    'Mahindra Scorpio N', 'Glossy Black',
    'diesel', 'manual', 7, 4000, 2300, 1300,
    ARRAY['Jalandhar', 'Phagwara'],
    'images/scorpion.jpg', 4.7, 42, 350,
    '["7 Seater", "4WD option", "Sony audio system", "6 airbags", "Wireless charging", "Cruise control"]',
    NULL, TRUE
  ),
  (
    'Kia Sonet Petrol', 'Midnight Black',
    'petrol', 'manual', 5, 2200, 1200, 800,
    ARRAY['Jalandhar', 'Phagwara'],
    'images/sonet.jpg', 4.6, 56, 300,
    '["Sunroof", "10.25\" infotainment", "Bose audio", "ADAS", "Wireless charging", "Ventilated seats"]',
    NULL, TRUE
  ),
  (
    'Kia Sonet Diesel', 'Midnight Black',
    'diesel', 'manual', 5, 2400, 1400, 900,
    ARRAY['Jalandhar', 'Phagwara'],
    'images/sonet.jpg', 4.5, 38, 350,
    '["Sunroof", "10.25\" infotainment", "ADAS safety", "Rear camera", "Auto climate control", "Cruise control"]',
    'Value Pick', TRUE
  ),
  (
    'Tata Punch Petrol', 'Pearl White',
    'petrol', 'manual', 5, 1800, 1000, 700,
    ARRAY['Jalandhar', 'Phagwara'],
    'images/punch.jpg', 4.6, 61, 300,
    '["Micro SUV", "10.25\" touchscreen", "Wireless CarPlay", "iRA connected tech", "Auto headlights", "6 airbags"]',
    'Best Value', TRUE
  );

-- ────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_listings ENABLE ROW LEVEL SECURITY;

-- Public can READ available cars
CREATE POLICY "Public can view available cars"
  ON cars FOR SELECT
  USING (TRUE);

-- Anyone can SELECT bookings (for Admin Dashboard)
CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  USING (TRUE);

-- Anyone can INSERT bookings
CREATE POLICY "Anyone can insert booking"
  ON bookings FOR INSERT
  WITH CHECK (TRUE);

-- Anyone can UPDATE bookings (for Admin status updates: confirmed, completed, cancelled)
CREATE POLICY "Anyone can update booking"
  ON bookings FOR UPDATE
  USING (TRUE);

-- Anyone can INSERT host listings
CREATE POLICY "Anyone can submit host listing"
  ON host_listings FOR INSERT
  WITH CHECK (TRUE);

-- ────────────────────────────────────────────
-- INDEXES for performance
-- ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cars_cities ON cars USING GIN (cities);
CREATE INDEX IF NOT EXISTS idx_cars_fuel ON cars (fuel);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings (car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings (pickup_date, dropoff_date);
