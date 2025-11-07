# Muğla Asist - Mobile App

React Native (Expo) mobil uygulama - Muğla öğrenci süper app'i.

## Tech Stack

- **Framework:** Expo (Managed Workflow)
- **Language:** TypeScript
- **Navigation:** React Navigation (Bottom Tabs + Stack)
- **Backend:** Supabase
- **State Management:** TanStack Query (React Query)
- **Icons:** @expo/vector-icons (Ionicons)

## Proje Yapısı

```
apps/mobile/
├── src/
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── queryClient.ts       # TanStack Query client
│   ├── navigation/
│   │   ├── RootNavigator.tsx    # Bottom Tabs (Ana navigasyon)
│   │   └── FoodStackNavigator.tsx # Yeme-İçme Stack
│   └── screens/
│       ├── FoodHomeScreen.tsx   # Yeme-İçme ana ekran
│       ├── TransportScreen.tsx  # Ulaşım ekranı
│       └── CampusScreen.tsx     # Kampüs ekranı
├── App.tsx                      # Entry point
├── index.js                     # Expo entry
├── app.config.js                # Expo config (env variables)
└── package.json
```

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd apps/mobile
npm install
```

### 2. Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın ve Supabase bilgilerinizi girin:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Uygulamayı Çalıştır

```bash
npm start
```

Ardından:
- **iOS:** Expo Go uygulamasıyla QR kodu tarayın veya `i` tuşuna basın
- **Android:** Expo Go uygulamasıyla QR kodu tarayın veya `a` tuşuna basın
- **Web:** `w` tuşuna basın

## Ana Özellikler (MVP)

### 3 Ana Tab:

1. **Yeme-İçme** (Stack Navigator)
   - Kategori listesi
   - Mekan filtreleme
   - Mekan detay sayfası
   - Açık/kapalı durumu

2. **Ulaşım**
   - Ring otobüs saatleri
   - Merkez otobüs saatleri
   - (services_data tablosundan)

3. **Kampüs**
   - Yemekhane menüsü
   - (services_data tablosundan)

## Geliştirme Notları

- **No Auth (MVP):** Şu anda giriş/kayıt yok, herkese açık veriler
- **RLS:** Backend'de Row Level Security etkin
- **Data Fetching:** TanStack Query hooks ile
- **Styling:** StyleSheet (Tailwind yok, native RN)

## Örnek Custom Hook (Gelecek)

```typescript
// src/hooks/useVenues.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useVenues(categoryId?: number) {
  return useQuery({
    queryKey: ['venues', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('venues')
        .select('*, categories(*)')
        .eq('is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
```

## Build (Production)

```bash
# EAS Build (gerekli: eas-cli)
npx eas-cli build --platform android
npx eas-cli build --platform ios
```

## Troubleshooting

### Metro bundler cache temizleme:
```bash
npm start -- --clear
```

### node_modules ve cache reset:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Proje Context

Detaylı proje bilgisi için: `../../docs/PROJECT_CONTEXT.md`
