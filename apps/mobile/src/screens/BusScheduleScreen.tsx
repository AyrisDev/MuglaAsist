import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBusRoutes, useBusRouteSchedules, useDeparturePoints } from '../hooks/useBusRoutes';
// import { DayOfWeek } from '../types/database'; // Bu artık gerekmeyebilir, 'string' kullanabiliriz
import { Colors } from '../constants/Colors';

// --- GÜN TANIMLARI DEĞİŞTİ ---
// 7 günlük listeyi kaldır
// const DAY_NAMES: { [key in DayOfWeek]: string } = { ... };
// const DAY_ORDER: DayOfWeek[] = [ ... ];

// Veritabanı ile eşleşen 3 kategorili sistemi kullan
type ScheduleDay = 'Hafta İçi' | 'Cumartesi' | 'Pazar';

const DAY_ORDER: ScheduleDay[] = ['Hafta İçi', 'Cumartesi', 'Pazar'];

// --- getDatabaseDayKey FONKSİYONU KALDIRILDI ---
// Artık 'selectedDay' state'i doğrudan DB anahtarını tutacak
// const getDatabaseDayKey = (appDay: DayOfWeek): string => { ... };

/**
 * Bugünün tarihine göre 3 kategoriden hangisinin
 * seçili gelmesi gerektiğini belirler.
 */
const getInitialDay = (): ScheduleDay => {
  const today = new Date().getDay(); // 0 = Pazar, 1 = Pazartesi, 6 = Cumartesi
  switch (today) {
    case 0: // Pazar
      return 'Pazar';
    case 6: // Cumartesi
      return 'Cumartesi';
    default: // Pazartesi - Cuma
      return 'Hafta İçi';
  }
};
// --- YENİ EKLENEN FONKSİYON SONU ---

export default function BusScheduleScreen() {
  const { data: routes, isLoading: routesLoading } = useBusRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeparturePoint, setSelectedDeparturePoint] = useState<string | null>(null);

  // --- selectedDay STATE'İ GÜNCELLENDİ ---
  const [selectedDay, setSelectedDay] = useState<ScheduleDay>(getInitialDay);
  // --- selectedDay STATE'İ GÜNCELLENDİ ---

  // Seçili hat için kalkış noktalarını çek
  const { data: departurePoints, isLoading: departurePointsLoading } = useDeparturePoints(
    selectedRouteId || 0
  );

  // Hat değiştiğinde kalkış noktasını sıfırla
  useEffect(() => {
    setSelectedDeparturePoint(null);
  }, [selectedRouteId]);

  // Filter routes by search query
  const filteredRoutes = useMemo(() => {
    if (!routes) return [];
    if (!searchQuery.trim()) return routes;

    const query = searchQuery.toLowerCase().trim();
    return routes.filter((route) =>
      route.name.toLowerCase().includes(query)
    );
  }, [routes, searchQuery]);

  const { data: schedules, isLoading: scheduleLoading } = useBusRouteSchedules(
    selectedRouteId || 0,
    selectedDeparturePoint || undefined
  );

  if (routesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Hatlar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Seçili hat yoksa ve arama sonucu varsa, ilk hattı seç
  if (!selectedRouteId && filteredRoutes && filteredRoutes.length > 0) {
    setSelectedRouteId(filteredRoutes[0].id);
  }

  // Seçili kalkış noktası yoksa ve kalkış noktaları yüklendiyse, ilk noktayı seç
  if (!selectedDeparturePoint && departurePoints && departurePoints.length > 0) {
    setSelectedDeparturePoint(departurePoints[0]);
  }

  // Seçili gün ve kalkış noktasına göre schedule bul
  const currentSchedule = schedules?.find(
    (s) => s.day_of_week === selectedDay
  );

  const departureTimes = currentSchedule?.departure_times || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Hat ara..."
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

      {/* Routes Selection */}
      <View style={styles.routesSection}>
        <Text style={styles.sectionTitle}>Hatlar</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.routesContainer}
        >
          {filteredRoutes?.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeChip,
                selectedRouteId === route.id && styles.routeChipActive,
              ]}
              onPress={() => setSelectedRouteId(route.id)}
            >
              <Text
                style={[
                  styles.routeChipText,
                  selectedRouteId === route.id && styles.routeChipTextActive,
                ]}
                numberOfLines={1} // Hat isimlerinin taşmamasını sağlar
              >
                {route.name} 
                {/* Sadece hat numarasını (örn: 1-48) gösterir */}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Departure Points Selection */}
      {departurePoints && departurePoints.length > 0 && (
        <View style={styles.departureSection}>
          <Text style={styles.sectionTitle}>Kalkış Noktası</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.departureContainer}
          >
            {departurePoints.map((point) => (
              <TouchableOpacity
                key={point}
                style={[
                  styles.departureChip,
                  selectedDeparturePoint === point && styles.departureChipActive,
                ]}
                onPress={() => setSelectedDeparturePoint(point)}
              >
                <Ionicons
                  name="location"
                  size={16}
                  color={selectedDeparturePoint === point ? Colors.primary : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.departureChipText,
                    selectedDeparturePoint === point && styles.departureChipTextActive,
                  ]}
                >
                  {point}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* --- DAYS SELECTION GÜNCELLENDİ (7 GÜNDEN 3 KATEGORİYE) --- */}
      <View style={styles.daysSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {DAY_ORDER.map((day) => {
            // 'isToday' mantığı, 'day'in mevcut kategoriyle eşleşmesine göre güncellendi
            const isToday = day === getInitialDay();

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  selectedDay === day && styles.dayChipActive,
                  isToday && styles.dayChipToday, // Bugünün kategorisini vurgula
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayChipText,
                    selectedDay === day && styles.dayChipTextActive,
                  ]}
                >
                  {day} {/* Artık doğrudan 'Hafta İçi', 'Cumartesi', 'Pazar' yazar */}
                </Text>
                {/* 'todayDot' kaldırıldı, 'dayChipToday' stili yeterli */}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {/* --- DAYS SELECTION GÜNCELLENDİ SONU --- */}


      {/* Schedule Times */}
      {scheduleLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : departureTimes.length > 0 ? (
        <ScrollView contentContainerStyle={styles.timesContent}>
          <View style={styles.timesGrid}>
            {departureTimes.map((time, index) => (
              <View key={index} style={styles.timeCard}>
                <Ionicons name="time-outline" size={16} color={Colors.primary} />
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>
            {selectedDeparturePoint && (
              <>
                <Text style={{fontWeight: 'bold'}}>{selectedDeparturePoint}</Text> kalkış noktası için{'\n'}
              </>
            )}
            <Text style={{fontWeight: 'bold'}}>{selectedDay}</Text> günü sefer bulunmuyor
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// --- STİLLERDE KÜÇÜK BİR İYİLEŞTİRME (Stil isimleri 7 günden 3 güne uyarlandı) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150, // Yüklenme göstergesinin çok küçük kalmasını engeller
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
    marginTop: 0,
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
  routesSection: {
    marginTop: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  routesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  routeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 42, // Yüksekliklerin eşit olmasını sağlar
    justifyContent: 'center', // Metni ortalar
  },
  routeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  routeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  routeChipTextActive: {
    color: Colors.background,
  },
  departureSection: {
    marginTop: 0,
    marginBottom: 16,
  },
  departureContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  departureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  departureChipActive: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.primary,
  },
  departureChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  departureChipTextActive: {
    color: Colors.primary,
  },
  daysSection: {
    marginBottom: 16,
  },
  daysContainer: {
    paddingHorizontal: 16,
    gap: 10, // 3 buton olduğu için aralığı biraz açtım
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayChipActive: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.primary,
  },
  dayChipToday: {
    borderColor: Colors.primary + '40',
  },
  dayChipText: {
    fontSize: 14, // Yazı tipini büyüttüm
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  dayChipTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  // todayDot kaldırıldı, artık kullanılmıyor
  timesContent: {
    padding: 16,
    paddingTop: 0,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 90, // "00:00" formatı için ideal
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -50, // Hata mesajını biraz yukarı taşır
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24, // Satır yüksekliği eklendi
  },
});

