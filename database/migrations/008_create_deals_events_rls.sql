-- Deals ve Events tabloları için RLS (Row Level Security) politikaları
-- Migration: 008_create_deals_events_rls.sql

-- ==================== DEALS TABLE ====================
-- RLS'i enable et
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- 1. SELECT politikası: Herkes aktif fırsatları okuyabilir
CREATE POLICY "Enable read access for active deals" ON deals
  FOR SELECT USING (is_active = true);

-- 2. INSERT politikası: Sadece admin kullanıcılar yeni fırsat ekleyebilir
CREATE POLICY "Enable insert for admin users only" ON deals
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. UPDATE politikası: Sadece admin kullanıcılar fırsat güncelleyebilir
CREATE POLICY "Enable update for admin users only" ON deals
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. DELETE politikası: Sadece admin kullanıcılar fırsat silebilir
CREATE POLICY "Enable delete for admin users only" ON deals
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ==================== EVENTS TABLE ====================
-- RLS'i enable et
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 1. SELECT politikası: Herkes aktif etkinlikleri okuyabilir
CREATE POLICY "Enable read access for active events" ON events
  FOR SELECT USING (is_active = true);

-- 2. INSERT politikası: Sadece admin kullanıcılar yeni etkinlik ekleyebilir
CREATE POLICY "Enable insert for admin users only" ON events
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. UPDATE politikası: Sadece admin kullanıcılar etkinlik güncelleyebilir
CREATE POLICY "Enable update for admin users only" ON events
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. DELETE politikası: Sadece admin kullanıcılar etkinlik silebilir
CREATE POLICY "Enable delete for admin users only" ON events
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
