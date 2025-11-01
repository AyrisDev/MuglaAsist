# Admin Panel Kurulum Kılavuzu

## 1. Bağımlılıkları Yükle

```bash
cd apps/admin
npm install
```

## 2. Environment Variables

`.env.local` dosyası oluştur:

```bash
cp .env.local.example .env.local
```

Dosyayı düzenle ve Supabase bilgilerini ekle:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Supabase Setup

### Admin Stats View Oluştur

SQL Editor'da çalıştır:

```sql
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM categories WHERE is_active = true) AS total_categories,
  (SELECT COUNT(*) FROM venues) AS total_venues,
  (SELECT COUNT(*) FROM venues WHERE is_active = true) AS active_venues,
  (SELECT COUNT(*) FROM venues WHERE is_featured = true AND is_active = true) AS featured_venues,
  (SELECT COUNT(*) FROM menu_items) AS total_menu_items,
  (SELECT COUNT(*) FROM menu_items WHERE is_approved = false) AS pending_approvals;
```

### Admin Kullanıcı Oluştur

```sql
-- 1. Admin kullanıcı ekle (auth.users)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@kotekli.edu.tr',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"role": "admin"}'::jsonb,
  '{}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- 2. Kimlik doğrulama ekle
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  id,
  format('{"sub": "%s", "email": "%s"}', id::text, email)::jsonb,
  'email',
  now(),
  now(),
  now()
FROM auth.users
WHERE email = 'admin@kotekli.edu.tr';
```

### RLS Politikaları

Her tablo için admin erişimi:

```sql
-- Örnek: categories tablosu için
CREATE POLICY "Admin full access to categories"
ON categories
FOR ALL
TO authenticated
USING (
  COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    auth.jwt() -> 'user_metadata' ->> 'role'
  ) = 'admin'
);
```

Tüm tablolar için tekrarla: `venues`, `menu_items`, `services_data`, `deals`, `events`

## 4. Geliştirme Sunucusu

```bash
npm run dev
```

Panel http://localhost:3001 adresinde çalışacak.

## 5. Giriş Bilgileri

```
Email: admin@kotekli.edu.tr
Şifre: admin123
```

**ÖNEMLİ:** Üretim ortamında şifreyi mutlaka değiştirin!

## 6. Sonraki Adımlar

- [ ] Kategoriler CRUD sayfalarını oluştur
- [ ] Mekanlar CRUD sayfalarını oluştur
- [ ] Menü ürünleri CRUD sayfalarını oluştur
- [ ] Fotoğraf upload özelliği ekle (Supabase Storage)
- [ ] Hizmetler yönetimi (Markdown editor)
- [ ] Etkinlikler ve Fırsatlar CRUD

## Dosya Yapısı

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── login/page.tsx          # Login sayfası
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Dashboard (istatistikler)
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   └── Sidebar.tsx             # Navigation sidebar
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client & auth
│   │   ├── types.ts                # Database types
│   │   └── utils.ts                # Utility functions
│   └── middleware.ts               # Route protection
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.local.example
```

## Özellikler

✅ **Tamamlanan:**
- Next.js 14 App Router
- TypeScript setup
- Tailwind CSS styling
- Supabase client
- Authentication flow (login/logout)
- Sidebar navigation
- Dashboard (admin_stats view)
- Route protection (middleware)

⏳ **Yapılacaklar:**
- CRUD sayfaları
- Form validation (React Hook Form + Zod)
- Image upload
- Markdown editor
- Search & filtering

## Troubleshooting

### "Missing Supabase environment variables" hatası
`.env.local` dosyasını oluşturdunuz mu? Değişkenleri doğru yazdığınızdan emin olun.

### Login çalışmıyor
- Supabase'de admin kullanıcısını oluşturdunuz mu?
- RLS politikalarını eklediniz mi?
- Browser console'da hata var mı?

### Middleware redirect loop
Cookie ayarlarını kontrol edin. Supabase client düzgün session yönetiyor mu?
