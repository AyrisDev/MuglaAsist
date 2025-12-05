import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import tr from './locales/tr.json';

const LANGUAGE_KEY = '@app_language';

// Get saved language or device language
const getInitialLanguage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage) {
            return savedLanguage;
        }
        // Get device language
        const deviceLanguage = Localization.locale.split('-')[0];
        return ['en', 'tr'].includes(deviceLanguage) ? deviceLanguage : 'tr';
    } catch (error) {
        return 'tr'; // Default to Turkish
    }
};

const resources = {
    en: {
        translation: en,
    },
    tr: {
        translation: tr,
    },
};

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources,
        lng: 'tr', // Will be updated after async storage check
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false,
        },
    });

// Initialize language from storage
getInitialLanguage().then((language) => {
    i18n.changeLanguage(language);
});

// Save language preference
export const changeLanguage = async (language: string) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
        await i18n.changeLanguage(language);
    } catch (error) {
        console.error('Error saving language:', error);
    }
};

export default i18n;
