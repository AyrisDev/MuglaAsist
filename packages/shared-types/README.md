# @kotekli/shared-types

Paylaşılan TypeScript types paketi - Admin Panel ve Mobile App arasında ortak kullanım için.

## Özellikler

- ✅ Tüm Supabase tablo types'ları
- ✅ JSONB field types (HoursJSON, Metadata)
- ✅ Helper types ve enum'lar
- ✅ Insert/Update types
- ✅ İlişkisel types (with relations)
- ✅ Database schema type (Supabase client için)

## Kurulum

### Monorepo içinde kullanım:

**Admin Panel (Next.js):**
```json
// apps/admin/package.json
{
  "dependencies": {
    "@kotekli/shared-types": "workspace:*"
  }
}
```

**Mobile App (Expo):**
```json
// apps/mobile/package.json
{
  "dependencies": {
    "@kotekli/shared-types": "workspace:*"
  }
}
```

### Build:

```bash
cd packages/shared-types
npm run build
```

## Kullanım

### Database Types:

```typescript
import type { Venue, Category, MenuItem } from '@kotekli/shared-types';

const venue: Venue = {
  id: 1,
  name: "Starbucks",
  slug: "starbucks",
  category_id: 1,
  description: "Coffee shop",
  logo_url: "https://...",
  cover_url: "https://...",
  phone: "+90 555 123 4567",
  location: "Campus Center",
  hours: {
    monday: {
      open: "09:00",
      close: "23:00",
      is_next_day: false
    },
    // ...
  },
  is_featured: true,
  is_active: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};
```

### Insert Types:

```typescript
import type { VenueInsert } from '@kotekli/shared-types';

const newVenue: VenueInsert = {
  name: "New Cafe",
  category_id: 2,
  description: "Great coffee",
  // ... (id, slug, created_at, updated_at otomatik)
};
```

### Supabase Client:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@kotekli/shared-types';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Tip güvenli query
const { data } = await supabase
  .from('venues')
  .select('*')
  .eq('is_active', true);
// data: Venue[] | null
```

### Hours JSON:

```typescript
import type { HoursJSON, DayName } from '@kotekli/shared-types';

const hours: HoursJSON = {
  [DayName.Monday]: {
    open: "09:00",
    close: "23:00",
    is_next_day: false,
  },
  [DayName.Friday]: {
    open: "09:00",
    close: "02:00",
    is_next_day: true, // Kapanış saati ertesi gün
  },
  // Cumartesi kapalı (undefined)
};
```

### Enums:

```typescript
import { DayName, ServiceDataKey } from '@kotekli/shared-types';

console.log(DayName.Monday); // "monday"
console.log(ServiceDataKey.BusRing); // "bus_ring"
```

## Dosya Yapısı

```
packages/shared-types/
├── src/
│   ├── utils.types.ts       # Helper types, enums
│   ├── database.types.ts    # Table types
│   └── index.ts             # Exports
├── dist/                    # Build output (gitignore)
├── package.json
├── tsconfig.json
└── README.md
```

## Types Listesi

### Tables:

- `Category` - Mekan kategorileri
- `Venue` - Mekanlar
- `MenuItem` - Menü ürünleri
- `ServiceData` - Hizmet verileri (ring, yemekhane)
- `Deal` - Fırsatlar (Faz 3)
- `Event` - Etkinlikler (Faz 3)

### Utility Types:

- `DayName` - Gün isimleri enum
- `DayHours` - Açılış/kapanış saatleri
- `HoursJSON` - Haftalık çalışma saatleri
- `Metadata` - Generic metadata
- `ID`, `Slug`, `URL`, `Price`, `Markdown` - Helper aliases

### Insert/Update Types:

Her tablo için:
- `{Table}Insert` - Yeni kayıt ekleme
- `{Table}Update` - Kayıt güncelleme

Örnek: `VenueInsert`, `VenueUpdate`

### Relation Types:

- `VenueWithCategory` - Venue + Category join
- `MenuItemWithVenue` - MenuItem + Venue join
- `DealWithVenue` - Deal + Venue join

## Güncelleme

Supabase schema değiştiğinde:

1. `src/database.types.ts` dosyasını güncelle
2. Build yap: `npm run build`
3. Değişiklikleri commit et

## Type Generation

**Manuel yönetiliyor** - `supabase gen types` kullanmıyoruz.

Neden?
- Daha iyi kontrol
- Custom helper types ekleyebilme
- Enum desteği
- Relation types

## Scripts

```bash
npm run build        # TypeScript build
npm run watch        # Watch mode
npm run clean        # Dist klasörünü temizle
npm run type-check   # Type check (emit yok)
```

## Monorepo Workflow

1. Shared types'ı güncelle
2. Build yap
3. Admin/Mobile app'lerde import et
4. Tip güvenli kod yaz! 🎉

## Örnekler

### Admin Panel (Next.js):

```typescript
// apps/admin/src/app/venues/page.tsx
import { supabase } from '@/lib/supabase';
import type { Venue } from '@kotekli/shared-types';

export default async function VenuesPage() {
  const { data: venues } = await supabase
    .from('venues')
    .select('*, categories(*)')
    .eq('is_active', true);

  return <VenueList venues={venues} />;
}
```

### Mobile App (React Native):

```typescript
// apps/mobile/src/hooks/useVenues.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Venue } from '@kotekli/shared-types';

export function useVenues(categoryId?: number) {
  return useQuery({
    queryKey: ['venues', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('venues')
        .select('*')
        .eq('is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Venue[];
    },
  });
}
```

## Lisans

MIT
