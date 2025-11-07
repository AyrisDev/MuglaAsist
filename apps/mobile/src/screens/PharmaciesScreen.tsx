import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// 1. Hook adını 'useOnDutyPharmacies' (çoğul) olarak değiştirin
//    (Bu hook'un tanımını da bir önceki mesajımdaki gibi .single() olmadan güncellediğinizi varsayıyorum)
import { usePharmacies, useOnDutyPharmacies } from '../hooks/usePharmacies';
import PharmacyCard from '../components/PharmacyCard';
import { Colors } from '../constants/Colors';

export default function PharmaciesScreen() {
  const { data: pharmacies, isLoading: pharmaciesLoading } = usePharmacies();
  // 2. Hook'u çoğul adıyla çağırın ve veriye 'onDutyPharmacies' deyin
  const { data: onDutyPharmacies, isLoading: onDutyLoading } = useOnDutyPharmacies();

  const isLoading = pharmaciesLoading || onDutyLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Eczaneler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 3. Nöbetçi eczaneleri belirle (Artık bir dizi)
  // 'onDutyPharmacies' dizisindeki tüm eczanelerin ID'lerini bir Set'e (hızlı arama için) al
  const onDutyIds = new Set(
    onDutyPharmacies?.map(item => item.pharmacy?.id)
  );

  // 4. Nöbetçi eczaneleri başa taşı
  const sortedPharmacies = pharmacies?.slice().sort((a, b) => {
    // Set'i kullanarak kontrol et
    if (onDutyIds.has(a.id)) return -1;
    if (onDutyIds.has(b.id)) return 1;
    return 0;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Pharmacies List */}
      {sortedPharmacies && sortedPharmacies.length > 0 ? (
        <FlatList
          data={sortedPharmacies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PharmacyCard
              pharmacy={item}
              // 5. 'isOnDuty' prop'unu Set ile kontrol et
              isOnDuty={onDutyIds.has(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical-outline" size={64} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>Eczane bulunamadı</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// STYLES (Değişiklik yok, kodunuzdaki ile aynı)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  // Not: Kodunuzda 'onDutyBanner' stilleri vardı ama JSX içinde kullanılmıyordu.
  // İhtiyaç duyarsanız 'sortedPharmacies' listesinin üstüne ekleyebilirsiniz.
  listContent: {
    padding: 16,
    paddingTop: 16, // 0'dan 16'ya aldım, daha iyi görünür
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
    marginTop: 12,
  },
});