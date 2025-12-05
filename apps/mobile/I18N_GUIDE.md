# i18n Implementation Guide

## Overview
The app now supports internationalization (i18n) with English and Turkish languages using `i18next` and `react-i18next`.

## Features
- ✅ English and Turkish language support
- ✅ Persistent language selection (saved to AsyncStorage)
- ✅ Device locale detection
- ✅ Language switcher component in Profile screen
- ✅ Dynamic tab labels
- ✅ Translated screens: EventDetailScreen, ProfileScreen, Navigation

## How to Use i18n in Your Components

### 1. Import the hook
```typescript
import { useTranslation } from 'react-i18next';
```

### 2. Use the hook in your component
```typescript
export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.loading')}</Text>
      <Text>{t('events.title')}</Text>
    </View>
  );
}
```

### 3. Available Translation Keys

#### Common
- `common.back`, `common.share`, `common.call`
- `common.addToCalendar`, `common.openInMap`
- `common.location`, `common.about`
- `common.loading`, `common.error`, `common.noData`
- `common.search`, `common.filter`, `common.save`, `common.cancel`
- `common.ok`, `common.yes`, `common.no`, `common.close`
- `common.open`, `common.closed`

#### Navigation
- `navigation.dashboard`, `navigation.events`, `navigation.deals`
- `navigation.life`, `navigation.profile`, `navigation.map`
- `navigation.transport`, `navigation.food`
- `navigation.barbers`, `navigation.hairdresser`, `navigation.pharmacies`

#### Events
- `events.title`, `events.eventDetail`, `events.notFound`
- `events.noDescription`, `events.noVenue`, `events.noLocation`
- `events.noPhone`, `events.aboutEvent`, `events.mapView`
- `events.months.jan` through `events.months.dec`

#### Deals
- `deals.title`, `deals.dealDetail`, `deals.notFound`
- `deals.noDescription`, `deals.noVenue`, `deals.noLocation`
- `deals.aboutDeal`, `deals.validUntil`, `deals.discount`

#### Venues
- `venues.title`, `venues.venueDetail`, `venues.notFound`
- `venues.noDescription`, `venues.noPhone`, `venues.noLocation`
- `venues.aboutVenue`, `venues.menu`, `venues.hours`, `venues.contact`

#### Profile
- `profile.title`, `profile.settings`, `profile.language`
- `profile.notifications`, `profile.about`, `profile.logout`
- `profile.selectLanguage`, `profile.turkish`, `profile.english`

#### Alerts
- `alerts.info`, `alerts.warning`, `alerts.error`, `alerts.success`

## Changing Language Programmatically

```typescript
import { changeLanguage } from '../i18n';

// Change to Turkish
await changeLanguage('tr');

// Change to English
await changeLanguage('en');
```

## Adding New Translations

1. Add the key to both `/src/i18n/locales/tr.json` and `/src/i18n/locales/en.json`
2. Use the key in your component with `t('your.new.key')`

Example:
```json
// tr.json
{
  "myFeature": {
    "title": "Başlık",
    "description": "Açıklama"
  }
}

// en.json
{
  "myFeature": {
    "title": "Title",
    "description": "Description"
  }
}
```

## Language Switcher Component

The `LanguageSwitcher` component is available for use in any screen:

```typescript
import LanguageSwitcher from '../components/LanguageSwitcher';

<LanguageSwitcher />
```

## Screens to Update

The following screens still need i18n implementation:
- [ ] DealDetailScreen
- [ ] VenueDetailScreen
- [ ] DashboardScreen
- [ ] EventsScreen
- [ ] DealsScreen
- [ ] LifeScreen
- [ ] TransportScreen
- [ ] FoodHomeScreen
- [ ] PharmaciesScreen
- [ ] BusScheduleScreen
- [ ] OnboardingScreen

## Example: Converting a Screen

Before:
```typescript
<Text>Etkinlik Detayı</Text>
<Text>Etkinlik bulunamadı</Text>
```

After:
```typescript
import { useTranslation } from 'react-i18next';

export default function MyScreen() {
  const { t } = useTranslation();
  
  return (
    <>
      <Text>{t('events.eventDetail')}</Text>
      <Text>{t('events.notFound')}</Text>
    </>
  );
}
```

## Testing

1. Open the app
2. Navigate to Profile screen
3. Use the Language Switcher to change between Turkish and English
4. Navigate to different screens to see translations in action
5. Close and reopen the app - your language preference should be saved

## Files Modified/Created

### Created:
- `/src/i18n/index.ts` - i18n configuration
- `/src/i18n/locales/tr.json` - Turkish translations
- `/src/i18n/locales/en.json` - English translations
- `/src/components/LanguageSwitcher.tsx` - Language switcher component

### Modified:
- `/App.tsx` - Initialize i18n
- `/src/navigation/RootNavigator.tsx` - Dynamic tab labels
- `/src/screens/EventDetailScreen.tsx` - Full i18n implementation
- `/src/screens/ProfileScreen.tsx` - Added language switcher

### Dependencies Added:
- `i18next`
- `react-i18next`
- `@react-native-async-storage/async-storage`
- `expo-localization`
