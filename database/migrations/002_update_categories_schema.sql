-- Categories tablosunu güncelle
-- Migration: 002_update_categories_schema.sql

-- 1. Yeni kolonları ekle (eğer yoksa)
DO $$
BEGIN
  -- icon_name kolonu ekle (icon'dan rename)
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='categories' AND column_name='icon') THEN
    ALTER TABLE categories RENAME COLUMN icon TO icon_name;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='categories' AND column_name='icon_name') THEN
    ALTER TABLE categories ADD COLUMN icon_name VARCHAR(50) NOT NULL DEFAULT '🍔';
  END IF;

  -- slug kolonu ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='categories' AND column_name='slug') THEN
    ALTER TABLE categories ADD COLUMN slug VARCHAR(255);
  END IF;

  -- order_index kolonu ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='categories' AND column_name='order_index') THEN
    ALTER TABLE categories ADD COLUMN order_index INTEGER DEFAULT 0 NOT NULL;
  END IF;

  -- updated_at kolonu ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='categories' AND column_name='updated_at') THEN
    ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
  END IF;
END $$;

-- 2. Mevcut kategoriler için slug generate et (eğer NULL ise)
UPDATE categories
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- 3. Slug'ı unique ve NOT NULL yap
ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
ALTER TABLE categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);

-- 4. Updated_at için trigger oluştur
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Index'ler ekle
CREATE INDEX IF NOT EXISTS idx_categories_order_index ON categories(order_index);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- NOT: Bu migration'ı çalıştırdıktan sonra 001_create_categories_rls.sql'i çalıştırın
