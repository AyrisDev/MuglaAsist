import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Colors } from '../constants/Colors';

export default function ProfileScreen() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('profile.title')}</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Placeholder for future settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
                    <Text style={styles.comingSoon}>Coming Soon</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: Colors.background,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    section: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    comingSoon: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
});
