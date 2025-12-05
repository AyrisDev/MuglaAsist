import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PharmacyCard from '../components/PharmacyCard';
import { Colors } from '../constants/Colors';
import { useOnDutyPharmacies, usePharmacies } from '../hooks/usePharmacies';

export default function PharmaciesScreen() {
  const navigation = useNavigation();
  const { data: pharmacies, isLoading: pharmaciesLoading } = usePharmacies();
  const { data: onDutyPharmacies, isLoading: onDutyLoading } = useOnDutyPharmacies();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Open Now' | 'Nearest'>('All');

  const isLoading = pharmaciesLoading || onDutyLoading;

  // Nöbetçi eczaneleri belirle
  const onDutyIds = useMemo(() => {
    return new Set(onDutyPharmacies?.map(item => item.pharmacy?.id));
  }, [onDutyPharmacies]);

  // Filter and Sort Logic
  const filteredPharmacies = useMemo(() => {
    if (!pharmacies) return [];

    let result = pharmacies;

    // 1. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.address && p.address.toLowerCase().includes(query))
      );
    }

    // 2. Category Filter
    if (activeFilter === 'Open Now') {
      result = result.filter(p => onDutyIds.has(p.id));
    }

    // 3. Sort (Always put On Duty first, then alphabetical)
    return result.sort((a, b) => {
      const aOnDuty = onDutyIds.has(a.id);
      const bOnDuty = onDutyIds.has(b.id);

      if (aOnDuty && !bOnDuty) return -1;
      if (!aOnDuty && bOnDuty) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [pharmacies, searchQuery, activeFilter, onDutyIds]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pharmacies</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or street"
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {['All', 'Open Now', 'Nearest'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.activeFilterChip
            ]}
            onPress={() => setActiveFilter(filter as any)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pharmacies List */}
      <FlatList
        data={filteredPharmacies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PharmacyCard
            pharmacy={item}
            isOnDuty={onDutyIds.has(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pharmacies found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});