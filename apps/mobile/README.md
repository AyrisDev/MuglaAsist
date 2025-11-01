# Kötekli Mobile App

React Native (Expo) öğrenci süper app mobil uygulaması.

## Teknolojiler

- Expo (Managed Workflow)
- React Native
- TypeScript
- React Navigation (Bottom Tabs + Stack)
- Supabase
- TanStack Query
- Expo SecureStore

## Kurulum

1. Gerekli paketleri yükleyin:

```bash
npm install
```

2. `.env` dosyası oluşturun:

```bash
cp .env.example .env
```

3. Supabase bilgilerinizi ekleyin:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Geliştirme

### Expo Go ile test:

```bash
npm start
```

Sonra telefonunuzda Expo Go app'i açın ve QR kodu tarayın.

### Platform-specific:

```bash
npm run android  # Android emülatör/cihaz
npm run ios      # iOS simulator (macOS gerekli)
npm run web      # Web browser
```

## Dosya Yapısı

```
apps/mobile/
├── App.tsx                    # Entry point
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx         # Bottom Tabs
│   │   └── FoodStackNavigator.tsx    # Food Stack
│   ├── screens/
│   │   ├── FoodHomeScreen.tsx        # Yeme-İçme ana sayfa
│   │   ├── TransportScreen.tsx       # Ulaşım sayfası
│   │   └── CampusScreen.tsx          # Kampüs sayfası
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client
│   │   └── queryClient.ts            # TanStack Query client
│   ├── types/
│   │   ├── database.ts               # Database types
│   │   └── navigation.ts             # Navigation types
│   ├── components/                   # Shared components
│   └── hooks/                        # Custom hooks
├── app.json                   # Expo config
├── package.json
└── tsconfig.json
```

## Ekranlar

### 3 Ana Tab:

1. **Yeme-İçme** (Food)
   - Kategoriler
   - Mekanlar
   - Menü görüntüleme
   - Açık/kapalı durumu

2. **Ulaşım** (Transport)
   - Ring otobüs saatleri
   - Merkez otobüs saatleri

3. **Kampüs** (Campus)
   - Yemekhane menüsü
   - Kampüs etkinlikleri (Faz 3)

## Özellikler

- [x] Bottom Tab Navigation
- [x] Stack Navigation (Food)
- [x] Supabase client setup
- [x] TanStack Query setup
- [x] TypeScript types
- [ ] Kategoriler listesi
- [ ] Mekanlar listesi
- [ ] Mekan detay sayfası
- [ ] Ring/Merkez otobüs saatleri
- [ ] Yemekhane menüsü

## Environment Variables

Expo'da environment variables `EXPO_PUBLIC_` prefix'i ile başlamalı:

```env
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Build & Deploy

### Development Build:

```bash
eas build --profile development --platform android
```

### Production Build:

```bash
eas build --profile production --platform all
```

### Submit to Stores:

```bash
eas submit --platform ios
eas submit --platform android
```

## Tips

- Expo Go sınırlamaları için: Custom native code gerekliyse Development Build kullanın
- Hot reload: Dosyaları kaydettiğinizde otomatik güncellenir
- Debug: Shake device → "Debug Remote JS"
- Clear cache: `expo start -c`

## Supabase RLS

Mobile app için RLS politikası:

```sql
-- Public read (herkes aktif kayıtları görebilir)
CREATE POLICY "Public read access"
ON public.venues
FOR SELECT
USING (is_active = true);
```

## Sonraki Adımlar

1. Custom hooks oluştur (useCategories, useVenues, etc.)
2. Category listesi component
3. Venue listesi component
4. Venue detay sayfası
5. Markdown renderer (services_data için)
6. Image caching (expo-image)
7. Pull-to-refresh
8. Skeleton loaders
