-- Services Data tablosu için RLS (Row Level Security) politikaları
-- Migration: 007_create_services_data_rls.sql

-- RLS'i enable et
ALTER TABLE services_data ENABLE ROW LEVEL SECURITY;

-- 1. SELECT politikası: Herkes service data'yı okuyabilir
CREATE POLICY "Enable read access for all users" ON services_data
  FOR SELECT USING (true);

-- 2. INSERT politikası: Sadece admin kullanıcılar yeni service data ekleyebilir
CREATE POLICY "Enable insert for admin users only" ON services_data
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. UPDATE politikası: Sadece admin kullanıcılar service data güncelleyebilir
CREATE POLICY "Enable update for admin users only" ON services_data
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. DELETE politikası: Sadece admin kullanıcılar service data silebilir
CREATE POLICY "Enable delete for admin users only" ON services_data
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
