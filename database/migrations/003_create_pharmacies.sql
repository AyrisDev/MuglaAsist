-- Eczaneler tablosu
CREATE TABLE IF NOT EXISTS pharmacies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Nöbetçi eczane tablosu (günlük)
CREATE TABLE IF NOT EXISTS on_duty_pharmacy (
  id SERIAL PRIMARY KEY,
  pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
  duty_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_pharmacies_is_active ON pharmacies(is_active);
CREATE INDEX idx_on_duty_pharmacy_date ON on_duty_pharmacy(duty_date);

-- RLS (Row Level Security) policies
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE on_duty_pharmacy ENABLE ROW LEVEL SECURITY;

-- Herkes aktif eczaneleri okuyabilir
CREATE POLICY "Enable read access for all users" ON pharmacies
  FOR SELECT USING (is_active = true);

-- Herkes nöbetçi eczane bilgisini okuyabilir
CREATE POLICY "Enable read access for all users" ON on_duty_pharmacy
  FOR SELECT USING (true);

-- Örnek veri ekleme
INSERT INTO pharmacies (name, address, phone, latitude, longitude) VALUES
  ('Merkez Eczanesi', 'Muğla Merkez', '0252 123 4567', 37.2153, 28.3636),
  ('Sağlık Eczanesi', 'Muğla Üniversitesi Kampüsü İçi', '0252 234 5678', 37.2165, 28.3645),
  ('Yeşil Eczane', 'Muğla Üniversitesi Kampüsü', '0252 345 6789', 37.2175, 28.3655),
  ('Gül Eczanesi', 'Muğla Üniversite Cad. No:12', '0252 456 7890', 37.2145, 28.3625),
  ('Kardelen Eczanesi', 'Muğla Merkez, Orhaniye Mah.', '0252 567 8901', 37.2185, 28.3665);

-- Nöbetçi eczane atama fonksiyonları

-- 1. İsme göre nöbetçi eczane atama
CREATE OR REPLACE FUNCTION set_on_duty_pharmacy(
  pharmacy_name_param TEXT,
  duty_date_param DATE DEFAULT CURRENT_DATE
)
RETURNS SETOF on_duty_pharmacy
LANGUAGE plpgsql
AS $$
DECLARE
  pharmacy_id_var INTEGER;
BEGIN
  SELECT id INTO pharmacy_id_var
  FROM pharmacies
  WHERE LOWER(name) = LOWER(pharmacy_name_param)
    AND is_active = true
  LIMIT 1;

  IF pharmacy_id_var IS NULL THEN
    RAISE EXCEPTION 'Eczane bulunamadı: %', pharmacy_name_param;
  END IF;

  INSERT INTO on_duty_pharmacy (pharmacy_id, duty_date)
  VALUES (pharmacy_id_var, duty_date_param)
  ON CONFLICT (duty_date)
  DO UPDATE SET
    pharmacy_id = pharmacy_id_var,
    created_at = NOW();

  RETURN QUERY
  SELECT * FROM on_duty_pharmacy WHERE duty_date = duty_date_param;
END;
$$;

-- 2. ID'ye göre nöbetçi eczane atama
CREATE OR REPLACE FUNCTION set_on_duty_pharmacy_by_id(
  pharmacy_id_param INTEGER,
  duty_date_param DATE DEFAULT CURRENT_DATE
)
RETURNS SETOF on_duty_pharmacy
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pharmacies
    WHERE id = pharmacy_id_param AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Geçerli bir eczane ID değil: %', pharmacy_id_param;
  END IF;

  INSERT INTO on_duty_pharmacy (pharmacy_id, duty_date)
  VALUES (pharmacy_id_param, duty_date_param)
  ON CONFLICT (duty_date)
  DO UPDATE SET
    pharmacy_id = pharmacy_id_param,
    created_at = NOW();

  RETURN QUERY
  SELECT * FROM on_duty_pharmacy WHERE duty_date = duty_date_param;
END;
$$;

-- NOT: Nöbetçi eczane bilgisi dışarıdan (API/scraping) çekilecek
-- Manuel olarak eklemek için:
-- SELECT set_on_duty_pharmacy('Merkez Eczanesi', CURRENT_DATE);
