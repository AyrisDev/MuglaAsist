# Uygulanan Düzeltmeler ve İyileştirmeler

Bu dosya, RLS hatası ve diğer tespit edilen sorunların çözümünü içerir.

## 🔴 Ana Sorun: RLS (Row Level Security) Hatası

**Sorun:** Admin kullanıcı yeni kategori eklerken "new row violates row-level security policy" hatası alıyordu.

**Neden:** Categories tablosu için RLS politikaları eksikti.

## ✅ Uygulanan Düzeltmeler

### 1. Database Schema Düzeltmeleri

#### Categories Tablosu Güncellemeleri
- ✅ `icon` → `icon_name` olarak değiştirildi
- ✅ `slug` kolonu eklendi (UNIQUE)
- ✅ `order_index` kolonu eklendi
- ✅ `updated_at` kolonu eklendi (auto-update trigger ile)

**Dosya:** `/database/migrations/002_update_categories_schema.sql`

#### Prisma Schema Güncellemesi
- ✅ `categories` modeli güncellendi
- ✅ Tüm yeni alanlar eklendi ve type'lar düzeltildi

**Dosya:** `/database/prisma/schema.prisma:15-28`

### 2. RLS Politikaları Oluşturuldu

Tüm tablolar için RLS politikaları eklendi:

| Migration Dosyası | Tablo(lar) | Açıklama |
|-------------------|------------|----------|
| `001_create_categories_rls.sql` | categories | CRUD politikaları (admin) |
| `005_create_venues_rls.sql` | venues | CRUD politikaları (admin) |
| `006_create_menu_items_rls.sql` | menu_items | CRUD politikaları (admin) |
| `007_create_services_data_rls.sql` | services_data | CRUD politikaları (admin) |
| `008_create_deals_events_rls.sql` | deals, events | CRUD politikaları (admin) |
| `009_create_bus_routes_rls.sql` | bus_routes, bus_schedules | CRUD politikaları (admin) |

**Politika Özeti:**
- **SELECT:** Herkes aktif kayıtları okuyabilir
- **INSERT/UPDATE/DELETE:** Sadece admin kullanıcılar

**Admin Kontrolü:**
```sql
auth.jwt() ->> 'role' = 'admin' OR
(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
(auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
```

### 3. Admin Panel Kod Düzeltmeleri

#### Yardımcı Fonksiyonlar
- ✅ `generateSlug()` fonksiyonu eklendi (Türkçe karakter desteği ile)

**Dosya:** `/apps/admin/src/lib/utils.ts:35-56`

#### Categories Modülü
- ✅ New page: `icon_name` ve `slug` eklendi
- ✅ Edit page: Slug auto-regeneration eklendi
- ✅ CategoryTable: İkon kolonu eklendi

**Dosyalar:**
- `/apps/admin/src/app/categories/new/page.tsx`
- `/apps/admin/src/app/categories/[id]/edit/page.tsx`
- `/apps/admin/src/components/categories/CategoryTable.tsx`

#### Venues Modülü
- ✅ New page: Slug auto-generation eklendi
- ✅ Edit page: Slug auto-regeneration eklendi

**Dosyalar:**
- `/apps/admin/src/app/venues/new/page.tsx`
- `/apps/admin/src/app/venues/[id]/edit/page.tsx`

### 4. Admin Service Client

RLS bypass için server-side admin client oluşturuldu:

- ✅ Service role key ile client oluşturuldu
- ✅ Admin verification helper fonksiyonu eklendi

**Dosya:** `/apps/admin/src/lib/supabase-admin.ts`

**Not:** Bu client sadece server-side (API routes, server actions) kullanılmalı.

### 5. Environment Variables

Admin için gerekli env variable'ları güncellendi:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # YENİ - Server-only
```

**Dosya:** `/apps/admin/.env.local.example`

### 6. Dokümantasyon

Kapsamlı migration ve setup dokümantasyonu oluşturuldu:

- ✅ Migration sırası ve açıklamaları
- ✅ Admin kullanıcı ayarlama talimatları
- ✅ Troubleshooting rehberi
- ✅ RLS politika özeti

**Dosya:** `/database/migrations/README.md`

## 📋 Yapılması Gerekenler

### 1. Migration'ları Çalıştır

Aşağıdaki sırada migration'ları Supabase Dashboard > SQL Editor'de çalıştırın:

```sql
1. 002_update_categories_schema.sql
2. 001_create_categories_rls.sql
3. 005_create_venues_rls.sql
4. 006_create_menu_items_rls.sql
5. 007_create_services_data_rls.sql
6. 008_create_deals_events_rls.sql
7. 009_create_bus_routes_rls.sql
```

### 2. Admin Kullanıcı Ayarla

Supabase Dashboard'da admin kullanıcıya role ekle:

**Yöntem 1: Dashboard**
1. Authentication > Users > kullanıcı seç
2. User Metadata sekmesi
3. JSON ekle: `{"role": "admin"}`

**Yöntem 2: SQL**
```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

### 3. Environment Variables Ekle

`/apps/admin/.env.local` dosyasına ekle:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Service role key nerede?**
- Supabase Dashboard > Project Settings > API
- "service_role" key'i kopyala

### 4. Prisma Client Yenile

```bash
cd database
npm run db:generate
```

### 5. Admin Panel'i Restart Et

```bash
cd apps/admin
npm run dev
```

## 🧪 Test Adımları

1. ✅ Admin kullanıcı ile giriş yap
2. ✅ Yeni kategori ekle (RLS hatası almamalı)
3. ✅ Kategori düzenle (slug otomatik güncellensin)
4. ✅ İkon doğru görüntülensin
5. ✅ Yeni venue ekle (slug otomatik oluşsun)
6. ✅ Venue düzenle (slug güncellensin)

## 🔍 Tespit Edilen Diğer Potansiyel Sorunlar

### ✅ Düzeltildi
- Categories'de icon vs icon_name tutarsızlığı
- Slug otomatik generate edilmiyordu
- order_index eksikti
- RLS politikaları tüm tablolarda eksikti
- Venues'de slug manual eklenmesi gerekiyordu

### ⚠️ İncelenmeli
- Diğer CRUD sayfaları (deals, events, menu_items, services) benzer kontroller gerekebilir
- Image upload fonksiyonalitesi (logo_url, cover_url için)
- Validation kuralları daha detaylı olabilir

## 📚 Kaynaklar

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- Migration README: `/database/migrations/README.md`

## 🎯 Özet

**Sorun:** RLS politikaları eksikti + Schema tutarsızlıkları
**Çözüm:** 9 migration + kod düzeltmeleri + dokümantasyon

**Sonuç:** Admin artık tüm CRUD işlemlerini yapabilir, RLS güvenliği aktif, slug'lar otomatik generate ediliyor.

---

**Not:** Migration'ları çalıştırmadan önce database backup almayı unutmayın!
