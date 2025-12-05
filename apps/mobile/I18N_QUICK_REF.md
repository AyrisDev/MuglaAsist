# i18n Quick Reference Card

## 🚀 Quick Start

### 1. Import the hook
```typescript
import { useTranslation } from 'react-i18next';
```

### 2. Use in component
```typescript
const { t } = useTranslation();
```

### 3. Translate text
```typescript
<Text>{t('common.loading')}</Text>
```

## 📖 Common Patterns

### Basic Translation
```typescript
{t('events.title')}  // "Etkinlikler" or "Events"
```

### With Fallback
```typescript
{event.name || t('events.noVenue')}
```

### In Alert
```typescript
Alert.alert(t('alerts.info'), t('events.noPhone'));
```

### Month Names
```typescript
const months = [
  t('events.months.jan'), t('events.months.feb'), 
  t('events.months.mar'), // ... etc
];
```

## 🎯 Most Used Keys

### Common Actions
```typescript
t('common.back')           // Geri / Back
t('common.call')           // Ara / Call
t('common.share')          // Paylaş / Share
t('common.save')           // Kaydet / Save
t('common.cancel')         // İptal / Cancel
t('common.search')         // Ara / Search
```

### Status Messages
```typescript
t('common.loading')        // Yükleniyor... / Loading...
t('common.error')          // Hata / Error
t('common.noData')         // Veri bulunamadı / No data found
```

### Navigation
```typescript
t('navigation.dashboard')  // Ana Sayfa / Home
t('navigation.events')     // Etkinlikler / Events
t('navigation.deals')      // Fırsatlar / Deals
t('navigation.profile')    // Profil / Profile
```

## 🔄 Change Language

```typescript
import { changeLanguage } from '../i18n';

// Switch to English
await changeLanguage('en');

// Switch to Turkish
await changeLanguage('tr');
```

## 🎨 Language Switcher Component

```typescript
import LanguageSwitcher from '../components/LanguageSwitcher';

<LanguageSwitcher />
```

## 📝 Adding New Keys

1. **Add to tr.json**
```json
{
  "myFeature": {
    "title": "Başlık",
    "subtitle": "Alt Başlık"
  }
}
```

2. **Add to en.json**
```json
{
  "myFeature": {
    "title": "Title",
    "subtitle": "Subtitle"
  }
}
```

3. **Use in code**
```typescript
<Text>{t('myFeature.title')}</Text>
<Text>{t('myFeature.subtitle')}</Text>
```

## ⚡ Pro Tips

1. **Always use translation keys** - Never hardcode strings
2. **Keep keys organized** - Group by feature/screen
3. **Use descriptive names** - `events.noPhone` not `events.err1`
4. **Test both languages** - Switch language and verify
5. **Check for missing keys** - Both files should have same structure

## 🐛 Troubleshooting

### Translation not showing?
1. Check key exists in both tr.json and en.json
2. Verify import: `import { useTranslation } from 'react-i18next';`
3. Check hook usage: `const { t } = useTranslation();`
4. Restart Metro bundler if needed

### Language not changing?
1. Check AsyncStorage permissions
2. Verify changeLanguage is awaited
3. Check i18n initialization in App.tsx

## 📱 Current Language

```typescript
const { i18n } = useTranslation();
const currentLang = i18n.language; // 'tr' or 'en'
```

## 🌍 Supported Languages

- 🇹🇷 Turkish (`tr`) - Default
- 🇬🇧 English (`en`)

## 📚 Full Key List

See `I18N_GUIDE.md` for complete list of available translation keys.

## ✅ Checklist for New Screen

- [ ] Import useTranslation
- [ ] Add const { t } = useTranslation()
- [ ] Replace all hardcoded strings with t('key')
- [ ] Add new keys to both tr.json and en.json
- [ ] Test in both languages
- [ ] Verify no hardcoded strings remain

## 🎓 Example: Complete Screen

```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function MyScreen() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('myScreen.title')}</Text>
      <Text>{t('myScreen.description')}</Text>
      <TouchableOpacity>
        <Text>{t('common.save')}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

**Need help?** Check `I18N_GUIDE.md` or `I18N_SUMMARY.md`
