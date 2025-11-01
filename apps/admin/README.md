# Kötekli Admin Panel

Next.js 14 tabanlı admin yönetim paneli.

## Teknolojiler

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- TanStack Query
- React Hook Form + Zod

## Kurulum

1. Gerekli paketleri yükleyin:

```bash
npm install
```

2. `.env.local` dosyası oluşturun:

```bash
cp .env.local.example .env.local
```

3. Supabase bilgilerinizi ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Geliştirme

```bash
npm run dev
```

Admin panel http://localhost:3001 adresinde çalışacaktır.

## Dosya Yapısı

```
apps/admin/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── login/        # Login sayfası
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Dashboard
│   ├── components/       # React bileşenleri
│   │   └── Sidebar.tsx   # Navigasyon sidebar
│   └── lib/              # Utilities & helpers
│       ├── supabase.ts   # Supabase client
│       ├── types.ts      # TypeScript types
│       └── utils.ts      # Utility functions
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Özellikler

- [x] Authentication (Supabase Auth)
- [x] Dashboard (Admin stats view)
- [x] Sidebar navigation
- [ ] Kategoriler CRUD
- [ ] Mekanlar CRUD
- [ ] Menü ürünleri CRUD
- [ ] Hizmetler yönetimi
- [ ] Etkinlikler CRUD
- [ ] Fırsatlar CRUD

## Admin Kullanıcı Oluşturma

Supabase SQL Editor'da:

```sql
-- Admin kullanıcı oluştur
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_app_meta_data)
VALUES (
  'admin@kotekli.edu.tr',
  crypt('your_password', gen_salt('bf')),
  now(),
  '{"role": "admin"}'::jsonb
);
```

## RLS Politikaları

Admin paneli için Supabase'de şu RLS politikasını kullanın:

```sql
-- Admin kontrolü
CREATE POLICY "Admin access"
ON public.tablename
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');
```
