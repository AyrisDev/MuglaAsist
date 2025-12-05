# 🌍 Internationalization (i18n) - MuglaAsist Mobile App

## Overview

The MuglaAsist mobile app now supports **English** and **Turkish** languages with full internationalization (i18n) capabilities. Users can seamlessly switch between languages, and their preference is automatically saved.

---

## ✨ Features

- ✅ **Dual Language Support**: English (🇬🇧) and Turkish (🇹🇷)
- ✅ **Persistent Language Selection**: Saved to device storage
- ✅ **Automatic Device Language Detection**: Uses system language on first launch
- ✅ **Real-time Language Switching**: No app restart required
- ✅ **Professional Language Switcher UI**: Visual selection with flags
- ✅ **Comprehensive Translations**: 150+ translation keys
- ✅ **Type-safe**: Full TypeScript support

---

## 📦 Dependencies

```json
{
  "i18next": "^23.x.x",
  "react-i18next": "^14.x.x",
  "@react-native-async-storage/async-storage": "^1.x.x",
  "expo-localization": "^15.x.x"
}
```

---

## 🏗️ Architecture

```
src/
├── i18n/
│   ├── index.ts              # i18n configuration
│   └── locales/
│       ├── tr.json           # Turkish translations
│       └── en.json           # English translations
├── components/
│   └── LanguageSwitcher.tsx  # Language selection UI
└── screens/
    └── ProfileScreen.tsx     # Settings with language switcher
```

---

## 🚀 Quick Start

### Using i18n in a Component

```typescript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.loading')}</Text>
      <Text>{t('events.title')}</Text>
      <Button title={t('common.save')} />
    </View>
  );
}
```

### Changing Language Programmatically

```typescript
import { changeLanguage } from '../i18n';

// Switch to English
await changeLanguage('en');

// Switch to Turkish
await changeLanguage('tr');
```

### Using the Language Switcher Component

```typescript
import LanguageSwitcher from '../components/LanguageSwitcher';

<LanguageSwitcher />
```

---

## 📖 Translation Keys

### Common (common.*)
Actions and UI elements used throughout the app:
- `back`, `share`, `call`, `save`, `cancel`, `search`
- `loading`, `error`, `noData`
- `open`, `closed`, `yes`, `no`

### Navigation (navigation.*)
Tab and screen titles:
- `dashboard`, `events`, `deals`, `life`, `profile`
- `food`, `transport`, `pharmacies`, `map`

### Events (events.*)
Event-related content:
- `title`, `eventDetail`, `notFound`
- `noDescription`, `noVenue`, `noLocation`
- `aboutEvent`, `mapView`
- `months.jan` through `months.dec`

### Deals (deals.*)
Deal/campaign content:
- `title`, `dealDetail`, `notFound`
- `validUntil`, `discount`, `aboutDeal`

### Venues (venues.*)
Venue/location content:
- `title`, `venueDetail`, `menu`, `hours`
- `contact`, `aboutVenue`

### Profile (profile.*)
User settings:
- `title`, `settings`, `language`
- `notifications`, `about`, `logout`
- `turkish`, `english`

### Alerts (alerts.*)
System messages:
- `info`, `warning`, `error`, `success`

---

## 🎯 Implemented Screens

| Screen | Status | Translation Coverage |
|--------|--------|---------------------|
| EventDetailScreen | ✅ Complete | 100% |
| EventsScreen | ✅ Complete | 100% |
| DealsScreen | ✅ Complete | 100% |
| ProfileScreen | ✅ Complete | 100% |
| RootNavigator | ✅ Complete | 100% |
| DealDetailScreen | ⏳ Pending | 0% |
| VenueDetailScreen | ⏳ Pending | 0% |
| DashboardScreen | ⏳ Pending | 0% |
| Other screens | ⏳ Pending | 0% |

---

## 📝 Adding New Translations

### Step 1: Add to Translation Files

**tr.json** (Turkish):
```json
{
  "myFeature": {
    "title": "Başlık",
    "description": "Açıklama",
    "button": "Kaydet"
  }
}
```

**en.json** (English):
```json
{
  "myFeature": {
    "title": "Title",
    "description": "Description",
    "button": "Save"
  }
}
```

### Step 2: Use in Component

```typescript
<Text>{t('myFeature.title')}</Text>
<Text>{t('myFeature.description')}</Text>
<Button title={t('myFeature.button')} />
```

---

## 🎨 Language Switcher UI

The language switcher provides:
- **Visual Language Selection**: Flags and language names
- **Active State Indicator**: Checkmark for selected language
- **Smooth Animations**: Professional transitions
- **Accessible Design**: Clear visual feedback

Located in: **Profile Screen → Language Section**

---

## 💾 Persistence

Language preference is stored using AsyncStorage:
- **Key**: `@app_language`
- **Values**: `'tr'` or `'en'`
- **Persistence**: Survives app restarts and updates

---

## 🌍 Language Detection

The app determines language in this order:

1. **Saved Preference**: Previously selected language
2. **Device Language**: System language (if Turkish or English)
3. **Default**: Turkish (fallback)

---

## 🧪 Testing

### Manual Testing Steps

1. **Start the app**
   ```bash
   npm start
   ```

2. **Navigate to Profile**
   - Open the app
   - Go to Profile tab

3. **Change Language**
   - Tap on language switcher
   - Select English or Turkish
   - Observe immediate UI changes

4. **Verify Persistence**
   - Close the app completely
   - Reopen the app
   - Verify language is still selected

5. **Test Different Screens**
   - Navigate to Events
   - Navigate to Deals
   - Verify all text is translated

---

## 🔧 Configuration

### i18n Configuration (`src/i18n/index.ts`)

```typescript
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'tr',              // Default language
    fallbackLng: 'tr',      // Fallback if translation missing
    interpolation: {
      escapeValue: false,   // React already escapes
    },
  });
```

---

## 📚 Documentation Files

- **I18N_SUMMARY.md**: Complete implementation summary
- **I18N_GUIDE.md**: Detailed usage guide with examples
- **I18N_QUICK_REF.md**: Quick reference card for developers

---

## 🐛 Troubleshooting

### Translation Not Showing?

1. **Check translation key exists** in both `tr.json` and `en.json`
2. **Verify import**: `import { useTranslation } from 'react-i18next';`
3. **Check hook usage**: `const { t } = useTranslation();`
4. **Restart Metro**: Sometimes bundler needs refresh

### Language Not Changing?

1. **Check AsyncStorage permissions**
2. **Verify `changeLanguage` is awaited**
3. **Check i18n initialization** in `App.tsx`
4. **Clear app data** and try again

### Missing Translations?

1. **Check JSON syntax** in translation files
2. **Ensure both files have same structure**
3. **Verify no typos** in translation keys
4. **Check console** for i18n warnings

---

## 🎓 Best Practices

1. **Never hardcode strings** - Always use translation keys
2. **Keep keys organized** - Group by feature/screen
3. **Use descriptive names** - `events.noPhone` not `events.err1`
4. **Test both languages** - Switch and verify all screens
5. **Keep files in sync** - Both JSON files should have same keys
6. **Use fallbacks** - `{item.name || t('common.noData')}`

---

## 🚀 Next Steps

### Screens to Implement

- [ ] DealDetailScreen
- [ ] VenueDetailScreen
- [ ] DashboardScreen
- [ ] LifeScreen
- [ ] TransportScreen
- [ ] FoodHomeScreen
- [ ] PharmaciesScreen
- [ ] BusScheduleScreen
- [ ] OnboardingScreen

### Future Enhancements

- [ ] Add more languages (Arabic, German, etc.)
- [ ] RTL support for Arabic
- [ ] Date/time localization
- [ ] Number formatting
- [ ] Currency formatting
- [ ] Pluralization rules

---

## 📞 Support

For questions or issues:
1. Check documentation files
2. Review example implementations
3. Test with provided examples
4. Verify translation files are valid JSON

---

## ✅ Checklist for New Developers

- [ ] Read this README
- [ ] Review `I18N_QUICK_REF.md`
- [ ] Check example screens (EventDetailScreen, ProfileScreen)
- [ ] Test language switching in app
- [ ] Try adding a new translation key
- [ ] Implement i18n in a pending screen

---

## 📊 Statistics

- **Total Translation Keys**: 150+
- **Languages Supported**: 2 (Turkish, English)
- **Screens Implemented**: 5
- **Components Created**: 1 (LanguageSwitcher)
- **Coverage**: ~30% of app screens

---

## 🎉 Success Criteria

✅ Users can switch between Turkish and English  
✅ Language preference persists across sessions  
✅ All implemented screens show correct translations  
✅ No hardcoded strings in implemented screens  
✅ Language switcher UI is intuitive and accessible  
✅ Device language is detected on first launch  

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
