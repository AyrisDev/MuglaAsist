-- Venues tablosu için RLS (Row Level Security) politikaları
-- Migration: 005_create_venues_rls.sql

-- RLS'i enable et
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- 1. SELECT politikası: Herkes aktif mekanları okuyabilir
CREATE POLICY "Enable read access for all users" ON venues
  FOR SELECT USING (is_active = true);

-- 2. INSERT politikası: Sadece admin kullanıcılar yeni mekan ekleyebilir
CREATE POLICY "Enable insert for admin users only" ON venues
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. UPDATE politikası: Sadece admin kullanıcılar mekan güncelleyebilir
CREATE POLICY "Enable update for admin users only" ON venues
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. DELETE politikası: Sadece admin kullanıcılar mekan silebilir
CREATE POLICY "Enable delete for admin users only" ON venues
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
