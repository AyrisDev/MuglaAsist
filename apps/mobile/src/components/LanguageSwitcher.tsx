import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { changeLanguage } from '../i18n';

export default function LanguageSwitcher() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const languages = [
        { code: 'tr', name: t('profile.turkish'), flag: '🇹🇷' },
        { code: 'en', name: t('profile.english'), flag: '🇬🇧' },
    ];

    const handleLanguageChange = async (languageCode: string) => {
        await changeLanguage(languageCode);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="language" size={20} color={Colors.primary} />
                <Text style={styles.title}>{t('profile.language')}</Text>
            </View>
            <View style={styles.languageList}>
                {languages.map((language) => (
                    <TouchableOpacity
                        key={language.code}
                        style={[
                            styles.languageItem,
                            currentLanguage === language.code && styles.languageItemActive,
                        ]}
                        onPress={() => handleLanguageChange(language.code)}
                    >
                        <View style={styles.languageInfo}>
                            <Text style={styles.flag}>{language.flag}</Text>
                            <Text
                                style={[
                                    styles.languageName,
                                    currentLanguage === language.code && styles.languageNameActive,
                                ]}
                            >
                                {language.name}
                            </Text>
                        </View>
                        {currentLanguage === language.code && (
                            <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    languageList: {
        gap: 12,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surfaceLight,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    languageItemActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    languageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    flag: {
        fontSize: 28,
    },
    languageName: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    languageNameActive: {
        color: Colors.text,
        fontWeight: 'bold',
    },
});
