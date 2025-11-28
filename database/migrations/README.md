# Database Migrations

Bu klasör Supabase database için migration dosyalarını içerir.

## Migration Sırası

Migration'ları aşağıdaki sırada çalıştırın:

### 1. Categories Setup
```sql
-- 002_update_categories_schema.sql
-- Categories tablosunu günceller (icon_name, slug, order_index, updated_at ekler)
```

### 2. RLS Politikaları (Sırayla)
```sql
-- 001_create_categories_rls.sql
-- 005_create_venues_rls.sql
-- 006_create_menu_items_rls.sql
-- 007_create_services_data_rls.sql
-- 008_create_deals_events_rls.sql
-- 009_create_bus_routes_rls.sql
```

### 3. Pharmacy & Bus (Zaten mevcut)
```sql
-- 003_create_pharmacies.sql
-- 004_create_bus_routes.sql
```

## Migration Nasıl Çalıştırılır?

### Yöntem 1: Supabase Dashboard (Önerilen)

1. [Supabase Dashboard](https://app.supabase.com)'a git
2. Projenizi seçin
3. Sol menüden **SQL Editor**'e tıklayın
4. **New Query** butonuna tıklayın
5. Migration dosyasının içeriğini kopyalayıp yapıştırın
6. **RUN** butonuna tıklayın
7. Diğer migration'lara geçin

### Yöntem 2: Supabase CLI

```bash
# Supabase CLI yüklü değilse
npm install -g supabase

# Migration'ı çalıştır
supabase db push
```

## Admin Kullanıcı Ayarlama

RLS politikaları admin kullanıcıları tanımak için `app_metadata` veya `user_metadata`'daki `role` alanını kontrol eder.

### Admin Rolü Ekleme:

1. Supabase Dashboard > **Authentication** > **Users**
2. Admin yapmak istediğiniz kullanıcıyı seçin
3. **User Metadata** sekmesine git
4. Şu JSON'u ekleyin:

```json
{
  "role": "admin"
}
```

veya **Raw user meta data**'ya direkt ekleyin.

### Alternatif: SQL ile Admin Ekleme

```sql
-- User ID'sini bulun
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- App metadata'ya admin rolü ekle
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

## Environment Variables

Admin panelinin düzgün çalışması için gerekli environment variables:

### `/apps/admin/.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Önemli:** `SUPABASE_SERVICE_ROLE_KEY` sadece server-side işlemler için kullanılır ve **asla** client-side'a expose edilmemelidir.

## RLS Politika Özeti

| Tablo | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `categories` | Aktif kategoriler (herkes) | Admin | Admin | Admin |
| `venues` | Aktif mekanlar (herkes) | Admin | Admin | Admin |
| `menu_items` | Onaylı & mevcut (herkes) | Admin | Admin | Admin |
| `services_data` | Herkes | Admin | Admin | Admin |
| `deals` | Aktif fırsatlar (herkes) | Admin | Admin | Admin |
| `events` | Aktif etkinlikler (herkes) | Admin | Admin | Admin |
| `pharmacies` | Aktif eczaneler (herkes) | RLS yok | RLS yok | RLS yok |
| `on_duty_pharmacy` | Herkes | RLS yok | RLS yok | RLS yok |
| `bus_routes` | Aktif hatlar (herkes) | Admin | Admin | Admin |
| `bus_schedules` | Herkes | Admin | Admin | Admin |

## Troubleshooting

### "new row violates row-level security policy"

Bu hata, kullanıcının admin rolü olmadığında oluşur. Çözüm:

1. Kullanıcının `user_metadata` veya `app_metadata`'sında `role: "admin"` olduğunu kontrol edin
2. Kullanıcı giriş yapıp tekrar oturum açmış olmalı (metadata değişikliği için)
3. JWT token'ın yenilenmesi gerekebilir

### Migration başarısız oldu

1. Migration'ları sırayla çalıştırdığınızdan emin olun
2. Önceki migration'ların başarılı olduğunu kontrol edin
3. Tablo zaten varsa, DROP TABLE yerine IF NOT EXISTS kullanın
4. Hata mesajını kontrol edin ve ilgili migration'ı düzeltin

### Admin kullanıcı işlem yapamıyor

1. Kullanıcının metadata'sını kontrol edin
2. JWT token'ın expire olmadığından emin olun
3. Logout/login yaparak token'ı yenileyin
4. Browser console'da hata mesajlarını kontrol edin

## İlgili Dosyalar

- `/apps/admin/src/lib/supabase.ts` - Normal Supabase client (RLS korumalı)
- `/apps/admin/src/lib/supabase-admin.ts` - Admin client (RLS bypass, server-only)
- `/database/prisma/schema.prisma` - Database schema
- `/apps/admin/src/lib/types.ts` - TypeScript type definitions

## Notlar

- RLS politikaları her zaman client-side'da çalışır
- Service role key sadece server-side (API routes, server actions) kullanılmalı
- Admin kullanıcı metadata değişikliği sonrası logout/login gerekebilir
- Migration'lar geri alınamaz, backup almayı unutmayın
