import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

// Define navigation types for the dashboard
// We need to be able to navigate to other stacks
type RootStackParamList = {
    Food: { screen: 'Geri' };
    Life: { screen: 'Pharmacies' | 'BusSchedule' };
    Events: { screen: 'Geri' };
    // Add other routes as needed
};

export default function DashboardScreen() {
    const navigation = useNavigation<any>();

    const handleNavigation = (route: string, screen?: string) => {
        if (screen) {
            navigation.navigate(route, { screen });
        } else {
            navigation.navigate(route);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="grid-outline" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MuglaAsist</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="settings-outline" size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Greeting */}
                <View style={styles.greetingContainer}>
                    <Text style={styles.greetingTitle}>Hello, Student!</Text>
                    <Text style={styles.greetingSubtitle}>What are you looking for today?</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search services..."
                        placeholderTextColor={Colors.textSecondary}
                    />
                </View>

                {/* Grid */}
                <View style={styles.gridContainer}>
                    {/* Pharmacy Card */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleNavigation('Life', 'Pharmacies')}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="medical" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Pharmacy</Text>
                        <Text style={styles.cardSubtitle}>Find nearby pharmacies</Text>
                    </TouchableOpacity>

                    {/* Bus Schedule Card */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleNavigation('Life', 'BusSchedule')}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="bus" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Bus Schedule</Text>
                        <Text style={styles.cardSubtitle}>Check bus timetables</Text>
                    </TouchableOpacity>

                    {/* Venue (Food) Card */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleNavigation('Food', 'Geri')}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="restaurant" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Venue</Text>
                        <Text style={styles.cardSubtitle}>Explore dining options</Text>
                    </TouchableOpacity>

                    {/* Events Card */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleNavigation('Events', 'Geri')}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="calendar" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Events</Text>
                        <Text style={styles.cardSubtitle}>See campus happenings</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#251B15', // Dark brown background from image
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    iconButton: {
        padding: 8,
    },
    greetingContainer: {
        marginBottom: 24,
    },
    greetingTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    greetingSubtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#33261F', // Slightly lighter brown
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#3E3028',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: Colors.text,
        fontSize: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    card: {
        width: '47%', // Slightly less than 50% to account for gap
        backgroundColor: '#33261F',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#3E3028',
        aspectRatio: 0.85, // Make them taller like in the image
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
});
