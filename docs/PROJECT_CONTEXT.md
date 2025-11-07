# Muğla Asist - Proje Context (Claude CLI İçin)

## Proje Özeti

Öğrenci süper app'i. Muğla öğrencileri için yemek, ulaşım, kampüs hizmetleri tek uygulamada.

## Teknoloji Stack

- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Admin Panel:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Mobile App:** React Native (Expo), TypeScript, React Navigation, TanStack Query
- **Shared:** Monorepo yapısı, paylaşılan types

## Veritabanı Şeması

### Tablolar:

1. **categories** - Mekan kategorileri (Kahveciler, Fast Food, vb)
2. **venues** - Mekanlar (logo, cover, hours JSON, location)
3. **menu_items** - Menü ürünleri (venue_id FK)
4. **services_data** - Hizmet verileri (data_key: "bus_ring", "cafeteria_menu")
5. **deals** - Fırsatlar (Faz 3)
6. **events** - Etkinlikler (Faz 3)

### Önemli Kolonlar:

- `venues.hours` - JSONB: `{"monday": {"open": "09:00", "close": "23:00", "is_next_day": false}}`
- `venues.slug` - Otomatik generate (trigger)
- `venues.is_featured` - Öne çıkan mekanlar
- `menu_items.is_approved` - AI menü onayı için

### RLS Politikaları:

- Public read: Herkes aktif kayıtları görebilir
- Admin write: `auth.jwt() ->> 'role' = 'admin'`

## Özellikler

### MVP (Faz 1) - GİRİŞ/KAYIT YOK!

1. **Yeme-İçme:**
   - Kategori listesi
   - Mekan listesi (filtreleme)
   - Mekan detay (menü, harita, arama)
   - Açık/kapalı durumu (hours JSON)
2. **Ulaşım:** Ring/Merkez otobüs saatleri (services_data)
3. **Kampüs:** Yemekhane menüsü (services_data)

### Admin Panel:

- Kategori CRUD
- Mekan CRUD (fotoğraf upload)
- Menü CRUD (ilişkisel)
- Hizmet verileri yönetimi (Markdown editor)
- İstatistikler dashboard

## Coding Standards

### TypeScript:

```typescript
// Database types shared
interface Venue {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  hours: HoursJSON;
  is_active: boolean;
}

type HoursJSON = {
  [key in DayName]?: {
    open: string; // "HH:MM"
    close: string;
    is_next_day: boolean;
  };
};
```

### React Patterns:

```typescript
// Custom hooks
export function useVenues(categoryId?: number) {
  return useQuery(["venues", categoryId], () =>
    supabase
      .from("venues")
      .select("*, categories(*)")
      .eq("is_active", true)
      .eq("category_id", categoryId || undefined)
  );
}

// Components: Functional, TypeScript, Tailwind
export function VenueCard({ venue }: { venue: Venue }) {
  return <div className="rounded-lg shadow p-4">{/* ... */}</div>;
}
```

### File Naming:

- Components: `PascalCase.tsx` (VenueCard.tsx)
- Hooks: `camelCase.ts` (useVenues.ts)
- Utils: `camelCase.ts` (formatPrice.ts)
- Types: `PascalCase.ts` (Database.types.ts)

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Backend only!
```

## Dependencies (Referans)

### Admin Panel:

- next, react, typescript
- @supabase/supabase-js
- @tanstack/react-query
- react-hook-form, zod
- tailwindcss, @shadcn/ui

### Mobile:

- expo, react-native
- @react-navigation/native, @react-navigation/bottom-tabs
- @tanstack/react-query
- expo-image, @expo/vector-icons

## Önemli Notlar

- **ASLA localStorage kullanma** (artifacts'ta çalışmaz)
- **ASLA service_role_key'i frontend'e koyma**
- **Her zaman RLS politikalarını düşün**
- **Image upload: Supabase Storage kullan**
- **Markdown render: react-markdown**
- **Date/time: date-fns veya dayjs (moment.js YOK)**

## Bu Dosyayı Her Zaman Güncel Tut!

Claude CLI bu context'e göre kod üretir. Yeni özellik eklendikçe buraya ekle.
