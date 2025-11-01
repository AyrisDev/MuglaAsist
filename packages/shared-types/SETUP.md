# Shared Types Kurulum Kılavuzu

## 1. Paket Build

```bash
cd packages/shared-types
npm install
npm run build
```

## 2. Workspace Kurulumu (Önerilen)

### Root package.json oluştur:

```json
// E:\Github\kotekli-app\package.json
{
  "name": "kotekli-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build:types": "npm run build --workspace=packages/shared-types"
  }
}
```

## 3. Admin Panel Entegrasyonu

### package.json güncelle:

```json
// apps/admin/package.json
{
  "dependencies": {
    "@kotekli/shared-types": "workspace:*"
  }
}
```

### Mevcut types dosyasını değiştir:

```bash
# Backup al
mv apps/admin/src/lib/types.ts apps/admin/src/lib/types.ts.bak

# Yeni types dosyası oluştur
```

```typescript
// apps/admin/src/lib/types.ts
// Re-export shared types
export * from '@kotekli/shared-types';
```

### Supabase client güncelle:

```typescript
// apps/admin/src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@kotekli/shared-types"; // ✅ Değişti

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

## 4. Mobile App Entegrasyonu

### package.json güncelle:

```json
// apps/mobile/package.json
{
  "dependencies": {
    "@kotekli/shared-types": "workspace:*"
  }
}
```

### Mevcut types dosyasını değiştir:

```bash
# Backup al
mv apps/mobile/src/types/database.ts apps/mobile/src/types/database.ts.bak

# Yeni index dosyası oluştur
```

```typescript
// apps/mobile/src/types/index.ts
// Re-export shared types
export * from '@kotekli/shared-types';
```

### Supabase client güncelle:

```typescript
// apps/mobile/src/lib/supabase.ts
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import type { Database } from "@kotekli/shared-types"; // ✅ Değişti

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Navigation types güncelle:

```typescript
// apps/mobile/src/types/navigation.ts
import type { Venue, Category } from "@kotekli/shared-types"; // ✅ Ekle

// Diğer navigation types...
```

## 5. Workspace Install

Root dizinde:

```bash
npm install
```

Bu komut tüm workspace'leri ve dependencies'i yükler.

## 6. Import Yollarını Güncelle

### Admin Panel:

Tüm `@/lib/types` import'ları otomatik çalışır (re-export sayesinde):

```typescript
// Değişiklik gerektirmez
import type { Venue, Category } from '@/lib/types';
```

Ya da direkt shared-types'tan:

```typescript
import type { Venue, Category } from '@kotekli/shared-types';
```

### Mobile App:

```typescript
// Eski
import type { Venue } from '../types/database';

// Yeni
import type { Venue } from '@kotekli/shared-types';
```

## 7. Type Generation Workflow

Schema değiştiğinde:

```bash
# 1. Shared types'ı güncelle
cd packages/shared-types/src
# database.types.ts dosyasını düzenle

# 2. Build
cd ../..
npm run build

# 3. Test
cd ../../apps/admin
npm run type-check

cd ../mobile
npm run type-check
```

## 8. VS Code Setup

`.vscode/settings.json` oluştur:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## 9. Monorepo Scripts

Root `package.json` scripts:

```json
{
  "scripts": {
    "build:types": "npm run build --workspace=packages/shared-types",
    "type-check": "npm run type-check --workspaces",
    "dev:admin": "npm run dev --workspace=apps/admin",
    "dev:mobile": "npm run start --workspace=apps/mobile"
  }
}
```

## 10. Alternatif (Workspace olmadan)

Workspace kullanmak istemiyorsanız:

### Manuel link:

```bash
cd packages/shared-types
npm run build
npm link

cd ../../apps/admin
npm link @kotekli/shared-types

cd ../mobile
npm link @kotekli/shared-types
```

### File path reference:

```json
// apps/admin/package.json
{
  "dependencies": {
    "@kotekli/shared-types": "file:../../packages/shared-types"
  }
}
```

## Sorun Giderme

### "Cannot find module '@kotekli/shared-types'"

```bash
# Root'ta workspace install
npm install

# Shared types build
npm run build:types
```

### Type hataları

```bash
# Cache temizle
rm -rf node_modules
rm package-lock.json
npm install
```

### Hot reload çalışmıyor

Shared types değiştiğinde apps'leri restart edin:

```bash
# Admin
npm run dev --workspace=apps/admin

# Mobile
npm run start --workspace=apps/mobile
```

## Başarılı Kurulum Testi

```typescript
// Test dosyası oluştur
// apps/admin/src/test-types.ts
import type { Venue, Database } from '@kotekli/shared-types';

const venue: Venue = {
  id: 1,
  name: "Test",
  // ... TypeScript hata vermemeli
};

console.log("✅ Shared types çalışıyor!");
```

Başarılı kurulum! 🎉
