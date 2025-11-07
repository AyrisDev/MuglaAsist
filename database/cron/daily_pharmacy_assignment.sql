-- Nöbetçi Eczane Fonksiyonları
-- NOT: Nöbetçi eczane bilgisi dışarıdan (web scraping/API) çekilecek

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
  -- Eczane adına göre ID bul
  SELECT id INTO pharmacy_id_var
  FROM pharmacies
  WHERE LOWER(name) = LOWER(pharmacy_name_param)
    AND is_active = true
  LIMIT 1;

  -- Eczane bulunamadıysa hata fırlat
  IF pharmacy_id_var IS NULL THEN
    RAISE EXCEPTION 'Eczane bulunamadı: %', pharmacy_name_param;
  END IF;

  -- Nöbetçi eczane kaydını ekle veya güncelle
  INSERT INTO on_duty_pharmacy (pharmacy_id, duty_date)
  VALUES (pharmacy_id_var, duty_date_param)
  ON CONFLICT (duty_date)
  DO UPDATE SET
    pharmacy_id = pharmacy_id_var,
    created_at = NOW();

  -- Eklenen/güncellenen kaydı döndür
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
  -- Eczane ID kontrolü
  IF NOT EXISTS (
    SELECT 1 FROM pharmacies
    WHERE id = pharmacy_id_param AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Geçerli bir eczane ID değil: %', pharmacy_id_param;
  END IF;

  -- Nöbetçi eczane kaydını ekle veya güncelle
  INSERT INTO on_duty_pharmacy (pharmacy_id, duty_date)
  VALUES (pharmacy_id_param, duty_date_param)
  ON CONFLICT (duty_date)
  DO UPDATE SET
    pharmacy_id = pharmacy_id_param,
    created_at = NOW();

  -- Eklenen/güncellenen kaydı döndür
  RETURN QUERY
  SELECT * FROM on_duty_pharmacy WHERE duty_date = duty_date_param;
END;
$$;

-- KULLANIM ÖRNEKLERİ:

-- İsme göre bugün için nöbetçi eczane atama:
-- SELECT set_on_duty_pharmacy('Merkez Eczanesi');

-- İsme göre belirli bir tarih için:
-- SELECT set_on_duty_pharmacy('Sağlık Eczanesi', '2024-11-05');

-- ID'ye göre bugün için:
-- SELECT set_on_duty_pharmacy_by_id(1);

-- ID'ye göre belirli bir tarih için:
-- SELECT set_on_duty_pharmacy_by_id(2, '2024-11-05');

-- Bugünün nöbetçi eczanesini görmek için:
-- SELECT p.name, od.duty_date
-- FROM on_duty_pharmacy od
-- JOIN pharmacies p ON p.id = od.pharmacy_id
-- WHERE od.duty_date = CURRENT_DATE;
