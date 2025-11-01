# Assets

Bu klasöre app icon, splash screen ve diğer assetleri ekleyin.

## Gerekli Dosyalar:

- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1242x2436)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (48x48)

## Oluşturma:

Expo'nun asset generation tool'unu kullanabilirsiniz:

```bash
npx expo-asset-generator --icon path/to/your-icon.png
```

Ya da placeholder'lar için:

```bash
# Default Expo assets kullanılabilir
npx create-expo-app temp-app
cp temp-app/assets/* apps/mobile/assets/
rm -rf temp-app
```
