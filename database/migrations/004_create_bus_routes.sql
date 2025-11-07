-- Otobüs Hatları ve Saatleri

-- Otobüs hatları tablosu
CREATE TABLE IF NOT EXISTS bus_routes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Otobüs saatleri tablosu
CREATE TABLE IF NOT EXISTS bus_schedules (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES bus_routes(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL, -- 'monday', 'tuesday', 'wednesday', etc.
  departure_point VARCHAR(255) NOT NULL, -- 'Menteşe Otogar', 'Yeniköy', etc.
  departure_times JSONB NOT NULL DEFAULT '[]', -- ["08:00", "09:30", "11:00"]
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(route_id, day_of_week, departure_point)
);

-- Index'ler
CREATE INDEX idx_bus_routes_is_active ON bus_routes(is_active);
CREATE INDEX idx_bus_schedules_route_id ON bus_schedules(route_id);
CREATE INDEX idx_bus_schedules_day ON bus_schedules(day_of_week);

-- RLS (Row Level Security) policies
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_schedules ENABLE ROW LEVEL SECURITY;

-- Herkes aktif hatları okuyabilir
CREATE POLICY "Enable read access for all users" ON bus_routes
  FOR SELECT USING (is_active = true);

-- Herkes otobüs saatlerini okuyabilir
CREATE POLICY "Enable read access for all users" ON bus_schedules
  FOR SELECT USING (true);

-- Örnek veri ekleme

-- Muğla - Menteşe hattı
INSERT INTO bus_routes (name, description) VALUES
  ('Muğla - Menteşe', 'Üniversite kampüsünden Menteşe ilçesine');

-- Muğla - Menteşe saatleri (Menteşe Otogar kalkış)
INSERT INTO bus_schedules (route_id, day_of_week, departure_point, departure_times)
VALUES
  (1, 'monday', 'Menteşe Otogar', '["07:30", "08:00", "08:30", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]'),
  (1, 'tuesday', 'Menteşe Otogar', '["07:30", "08:00", "08:30", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]'),
  (1, 'wednesday', 'Menteşe Otogar', '["07:30", "08:00", "08:30", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]'),
  (1, 'thursday', 'Menteşe Otogar', '["07:30", "08:00", "08:30", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]'),
  (1, 'friday', 'Menteşe Otogar', '["07:30", "08:00", "08:30", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]'),
  (1, 'saturday', 'Menteşe Otogar', '["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "16:00", "18:00"]'),
  (1, 'sunday', 'Menteşe Otogar', '["09:00", "11:00", "14:00", "17:00"]');

-- Muğla - Menteşe saatleri (Yeniköy kalkış)
INSERT INTO bus_schedules (route_id, day_of_week, departure_point, departure_times)
VALUES
  (1, 'monday', 'Yeniköy', '["07:45", "08:15", "08:45", "09:15", "10:15", "11:15", "12:15", "13:15", "14:15", "15:15", "16:15", "17:15", "18:15"]'),
  (1, 'tuesday', 'Yeniköy', '["07:45", "08:15", "08:45", "09:15", "10:15", "11:15", "12:15", "13:15", "14:15", "15:15", "16:15", "17:15", "18:15"]'),
  (1, 'wednesday', 'Yeniköy', '["07:45", "08:15", "08:45", "09:15", "10:15", "11:15", "12:15", "13:15", "14:15", "15:15", "16:15", "17:15", "18:15"]'),
  (1, 'thursday', 'Yeniköy', '["07:45", "08:15", "08:45", "09:15", "10:15", "11:15", "12:15", "13:15", "14:15", "15:15", "16:15", "17:15", "18:15"]'),
  (1, 'friday', 'Yeniköy', '["07:45", "08:15", "08:45", "09:15", "10:15", "11:15", "12:15", "13:15", "14:15", "15:15", "16:15", "17:15", "18:15"]'),
  (1, 'saturday', 'Yeniköy', '["08:15", "09:15", "10:15", "11:15", "12:15", "14:15", "16:15", "18:15"]'),
  (1, 'sunday', 'Yeniköy', '["09:15", "11:15", "14:15", "17:15"]');

-- Ring Otobüsü
INSERT INTO bus_routes (name, description) VALUES
  ('Ring Otobüsü', 'Kampüs içi ring hattı');

-- Ring otobüsü saatleri
INSERT INTO bus_schedules (route_id, day_of_week, departure_point, departure_times)
VALUES
  (2, 'monday', 'Kampüs İçi', '["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]'),
  (2, 'tuesday', 'Kampüs İçi', '["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]'),
  (2, 'wednesday', 'Kampüs İçi', '["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]'),
  (2, 'thursday', 'Kampüs İçi', '["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]'),
  (2, 'friday', 'Kampüs İçi', '["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]'),
  (2, 'saturday', 'Kampüs İçi', '[]'),
  (2, 'sunday', 'Kampüs İçi', '[]');
