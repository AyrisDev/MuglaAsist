-- Bus Routes ve Bus Schedules tabloları için RLS (Row Level Security) politikaları
-- Migration: 009_create_bus_routes_rls.sql

-- ==================== BUS_ROUTES TABLE ====================
-- RLS'i enable et
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;

-- 1. SELECT politikası: Herkes aktif otobüs hatlarını okuyabilir
CREATE POLICY "Enable read access for active routes" ON bus_routes
  FOR SELECT USING (is_active = true);

-- 2. INSERT politikası: Sadece admin kullanıcılar yeni hat ekleyebilir
CREATE POLICY "Enable insert for admin users only" ON bus_routes
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. UPDATE politikası: Sadece admin kullanıcılar hat güncelleyebilir
CREATE POLICY "Enable update for admin users only" ON bus_routes
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. DELETE politikası: Sadece admin kullanıcılar hat silebilir
CREATE POLICY "Enable delete for admin users only" ON bus_routes
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ==================== BUS_SCHEDULES TABLE ====================
-- RLS'i enable et
ALTER TABLE bus_schedules ENABLE ROW LEVEL SECURITY;

-- 1. SELECT politikası: Herkes otobüs saatlerini okuyabilir
CREATE POLICY "Enable read access for all users" ON bus_schedules
  FOR SELECT USING (true);

-- 2. INSERT politikası: Sadece admin kullanıcılar yeni saat ekleyebilir
CREATE POLICY "Enable insert for admin users only" ON bus_schedules
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. UPDATE politikası: Sadece admin kullanıcılar saat güncelleyebilir
CREATE POLICY "Enable update for admin users only" ON bus_schedules
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. DELETE politikası: Sadece admin kullanıcılar saat silebilir
CREATE POLICY "Enable delete for admin users only" ON bus_schedules
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
