# Database - Prisma Setup

Muğla Asist projesi için Prisma database yönetim klasörü.

## Kurulum

### 1. Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve Supabase connection string'inizi ekleyin:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

### 2. Prisma Client Oluştur

```bash
npm run db:generate
```

## Kullanım

### Prisma Studio (Database GUI)

Database'i görsel olarak yönetmek için:

```bash
npm run db:studio
```

Browser'da http://localhost:5555 adresinde açılır.

### Database Schema'yı Push Et

Prisma schema'daki değişiklikleri database'e uygula:

```bash
npm run db:push
```

### Mevcut Database'den Schema Çek

Supabase'deki mevcut tabloları Prisma schema'ya çek:

```bash
npm run db:pull
```

### Migration Oluştur

Production için migration oluştur:

```bash
npm run db:migrate
```

## Prisma Schema

`prisma/schema.prisma` dosyasında tüm database modelleri tanımlı:

- **categories** - Mekan kategorileri
- **venues** - Mekanlar (logo, cover, hours, rating, distance)
- **menu_items** - Menü ürünleri
- **services_data** - Hizmet verileri (otobüs, yemekhane)
- **deals** - Fırsatlar (Faz 3)
- **events** - Etkinlikler (Faz 3)
- **pharmacies** - Eczaneler (ad, adres, telefon, konum)
- **on_duty_pharmacy** - Nöbetçi eczane (günlük)

## Önemli Notlar

- **DATABASE_URL**: Supabase Project Settings > Database > Connection String'den alın
- **Connection Pooling**: Production'da `?pgbouncer=true` parametresi kullanın
- **RLS Politikaları**: Supabase'de RLS politikalarını ayrıca yönetmelisiniz
- **Prisma Client**: Her schema değişikliğinde `npm run db:generate` çalıştırın

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run db:studio` | Prisma Studio'yu aç (GUI) |
| `npm run db:push` | Schema değişikliklerini DB'ye uygula |
| `npm run db:pull` | DB'deki tabloları schema'ya çek |
| `npm run db:generate` | Prisma Client oluştur |
| `npm run db:migrate` | Migration oluştur ve uygula |
| `npm run db:seed` | Seed data ekle (eğer varsa) |

## Supabase Connection String Örneği

```
postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

## Troubleshooting

### "Environment variable not found: DATABASE_URL"

`.env` dosyasını oluşturup `DATABASE_URL` ekleyin.

### "Can't reach database server"

- Supabase connection string'i doğru mu kontrol edin
- Şifrenizi doğru girdiğinizden emin olun
- Internet bağlantınızı kontrol edin

### Schema değişiklikleri yansımıyor

```bash
npm run db:generate
```

komutunu çalıştırın.

---

## Eczaneler Modülü

### Database Yapısı

#### `pharmacies` Tablosu
Kampüs çevresindeki eczaneleri tutar:
- `id`: Primary key
- `name`: Eczane adı
- `address`: Adres
- `phone`: Telefon numarası
- `latitude`, `longitude`: GPS koordinatları
- `is_active`: Aktif mi?
- `created_at`: Oluşturulma tarihi

#### `on_duty_pharmacy` Tablosu
Günlük nöbetçi eczane bilgisi:
- `id`: Primary key
- `pharmacy_id`: Nöbetçi eczane referansı (foreign key)
- `duty_date`: Nöbet tarihi (UNIQUE - günde bir eczane)
- `created_at`: Oluşturulma tarihi

### Migration Çalıştırma

1. Supabase Dashboard'a giriş yapın
2. SQL Editor'e gidin
3. `migrations/003_create_pharmacies.sql` dosyasını açın
4. SQL'i kopyalayıp çalıştırın

Bu migration:
- ✅ `pharmacies` ve `on_duty_pharmacy` tablolarını oluşturur
- ✅ İndexleri ekler
- ✅ RLS politikalarını ayarlar
- ✅ 5 örnek eczane ekler
- ✅ Nöbetçi eczane atama fonksiyonlarını oluşturur

### Nöbetçi Eczane Yönetimi

Nöbetçi eczane bilgisi dışarıdan (web scraping/API) çekilecek ve manuel olarak atanacaktır.

#### Fonksiyonlar

##### 1. `set_on_duty_pharmacy(pharmacy_name, duty_date)`
Eczane adına göre nöbetçi eczane atar veya günceller.

**Parametreler:**
- `pharmacy_name` (TEXT): Eczane adı (case-insensitive)
- `duty_date` (DATE, optional): Nöbet tarihi (default: bugün)

**Kullanım:**
```sql
-- Bugün için nöbetçi eczane ata
SELECT set_on_duty_pharmacy('Merkez Eczanesi');

-- Belirli bir tarih için
SELECT set_on_duty_pharmacy('Sağlık Eczanesi', '2024-11-05');
```

##### 2. `set_on_duty_pharmacy_by_id(pharmacy_id, duty_date)`
Eczane ID'sine göre nöbetçi eczane atar veya günceller.

**Parametreler:**
- `pharmacy_id` (INTEGER): Eczane ID
- `duty_date` (DATE, optional): Nöbet tarihi (default: bugün)

**Kullanım:**
```sql
-- Bugün için nöbetçi eczane ata (ID ile)
SELECT set_on_duty_pharmacy_by_id(1);

-- Belirli bir tarih için
SELECT set_on_duty_pharmacy_by_id(2, '2024-11-05');
```

#### Nöbetçi Eczane Sorgulama

**Bugünün nöbetçi eczanesini görüntüle:**
```sql
SELECT p.name, p.address, p.phone, od.duty_date
FROM on_duty_pharmacy od
JOIN pharmacies p ON p.id = od.pharmacy_id
WHERE od.duty_date = CURRENT_DATE;
```

**Tüm eczaneleri listele:**
```sql
SELECT id, name, address, phone
FROM pharmacies
WHERE is_active = true
ORDER BY name;
```

#### API/Scraping Entegrasyonu

Nöbetçi eczane bilgisi dışarıdan çekildiğinde:

1. Web scraping ile eczane adını alın
2. `set_on_duty_pharmacy()` fonksiyonunu çağırın
3. Eğer eczane bulunamazsa hata döner

**Örnek Backend Kodu (Node.js/Supabase):**
```javascript
// Scraping'den gelen eczane adı
const pharmacyName = 'Merkez Eczanesi';

// Supabase RPC ile fonksiyonu çağır
const { data, error } = await supabase
  .rpc('set_on_duty_pharmacy', {
    pharmacy_name_param: pharmacyName,
    duty_date_param: new Date().toISOString().split('T')[0]
  });
```

Kaynak kod: `cron/daily_pharmacy_assignment.sql`
