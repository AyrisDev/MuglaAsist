import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryChip from '../components/CategoryChip';
import VenueCard from '../components/VenueCard';
import { Colors } from '../constants/Colors';
import { useCategories } from '../hooks/useCategories';
import { useVenues } from '../hooks/useVenues';
import { FoodStackParamList } from '../navigation/FoodStackNavigator';
import { isVenueOpen } from '../utils/isVenueOpen';

type Props = NativeStackScreenProps<FoodStackParamList, 'Geri'>;

export default function FoodHomeScreen({ navigation }: Props) {
  // selectedCategoryId: 0 for All, -1 for Open Now, >0 for specific categories
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: venues, isLoading: venuesLoading } = useVenues({
    categoryId: selectedCategoryId > 0 ? selectedCategoryId : undefined,
  });

  // Filter venues
  const filteredVenues = useMemo(() => {
    if (!venues) return [];

    let result = venues;

    // Filter by Open Now if selected
    if (selectedCategoryId === -1) {
      result = result.filter(venue => isVenueOpen(venue.hours));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((venue) =>
        venue.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [venues, searchQuery, selectedCategoryId]);

  if (categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Construct chips data
  // 0: All, -1: Open Now, then categories
  const allChips = [
    { id: 0, name: 'All', icon: '', is_active: true, created_at: '' },
    { id: -1, name: 'Open Now', icon: '', is_active: true, created_at: '' },
    ...(categories || []),
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Dashboard' as any)} // Navigate back to Dashboard
        >
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Venues</Text>
        <View style={{ width: 28 }} /> {/* Spacer for alignment */}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a cafe, shop..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Categories / Filters */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {allChips.map((chip) => (
            <CategoryChip
              key={chip.id}
              category={chip}
              isActive={selectedCategoryId === chip.id}
              onPress={() => setSelectedCategoryId(chip.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Venues List */}
      {venuesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredVenues.length > 0 ? (
        <FlatList
          data={filteredVenues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VenueCard
              venue={item}
              onPress={() =>
                navigation.navigate('VenueDetail', { venueId: item.id })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No venues found
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight, // Using lighter brown for input
    borderRadius: 24, // More rounded as per design
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0, // Reset default padding
  },
  categoriesSection: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
