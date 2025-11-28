-- Categories tablosu için RLS (Row Level Security) politikaları
-- Migration: 001_create_categories_rls.sql

-- RLS'i enable et
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 1. SELECT politikası: Herkes aktif kategorileri okuyabilir (anonim kullanıcılar dahil)
CREATE POLICY "Enable read access for all users" ON categories
  FOR SELECT USING (is_active = true);

-- 2. INSERT politikası: Sadece admin kullanıcılar yeni kategori ekleyebilir
CREATE POLICY "Enable insert for admin users only" ON categories
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. UPDATE politikası: Sadece admin kullanıcılar kategori güncelleyebilir
CREATE POLICY "Enable update for admin users only" ON categories
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. DELETE politikası: Sadece admin kullanıcılar kategori silebilir
CREATE POLICY "Enable delete for admin users only" ON categories
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Notlar:
-- 1. Bu migration'ı Supabase Dashboard > SQL Editor'de çalıştırın
-- 2. Admin kullanıcıların app_metadata veya user_metadata'sında role = 'admin' olmalı
-- 3. Admin kullanıcı oluşturmak için:
--    Supabase Dashboard > Authentication > Users > kullanıcı seçin
--    User metadata veya App metadata'ya ekleyin: {"role": "admin"}
