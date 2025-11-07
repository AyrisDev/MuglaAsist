import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { FoodStackParamList } from '../navigation/FoodStackNavigator';
import { useCategories } from '../hooks/useCategories';
import { useVenues } from '../hooks/useVenues';
import CategoryChip from '../components/CategoryChip';
import VenueCard from '../components/VenueCard';
import { Colors } from '../constants/Colors';

type Props = NativeStackScreenProps<FoodStackParamList, 'Geri'>;

export default function FoodHomeScreen({ navigation }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: venues, isLoading: venuesLoading } = useVenues({
    categoryId: selectedCategoryId || undefined,
  });

  // Filter venues by search query (must be before early returns)
  const filteredVenues = useMemo(() => {
    if (!venues) return [];
    if (!searchQuery.trim()) return venues;

    const query = searchQuery.toLowerCase().trim();
    return venues.filter((venue) =>
      venue.name.toLowerCase().includes(query)
    );
  }, [venues, searchQuery]);

  if (categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  // Add "Tümü" category at the beginning
  const allCategories = categories
    ? [{ id: 0, name: 'Tümü', icon: '', is_active: true, created_at: '' }, ...categories]
    : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Mekan ara..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={Colors.textSecondary}
            style={styles.clearIcon}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {allCategories.map((category) => (
            <CategoryChip
              key={category.id}
              category={category}
              isActive={selectedCategoryId === category.id || (category.id === 0 && selectedCategoryId === null)}
              onPress={() => setSelectedCategoryId(category.id === 0 ? null : category.id)}
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
            {searchQuery ? 'Arama sonucu bulunamadı' : 'Mekan bulunamadı'}
          </Text>
          {searchQuery && (
            <Text style={styles.emptySubtext}>
              "{searchQuery}" için sonuç yok
            </Text>
          )}
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: Colors.text,
  },
  clearIcon: {
    marginLeft: 8,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
