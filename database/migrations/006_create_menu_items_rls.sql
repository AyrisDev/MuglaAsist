-- Menu Items tablosu için RLS (Row Level Security) politikaları
-- Migration: 006_create_menu_items_rls.sql

-- RLS'i enable et
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- 1. SELECT politikası: Herkes onaylanmış ve mevcut menü ürünlerini okuyabilir
CREATE POLICY "Enable read access for approved items" ON menu_items
  FOR SELECT USING (is_approved = true AND is_available = true);

-- 2. INSERT politikası: Sadece admin kullanıcılar yeni menü ürünü ekleyebilir
CREATE POLICY "Enable insert for admin users only" ON menu_items
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. UPDATE politikası: Sadece admin kullanıcılar menü ürünü güncelleyebilir
CREATE POLICY "Enable update for admin users only" ON menu_items
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. DELETE politikası: Sadece admin kullanıcılar menü ürünü silebilir
CREATE POLICY "Enable delete for admin users only" ON menu_items
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
