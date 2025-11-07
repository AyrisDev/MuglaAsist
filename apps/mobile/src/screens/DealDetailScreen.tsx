import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useDealDetail } from '../hooks/useDeals';
import { DealsStackParamList } from '../navigation/DealsStackNavigator';
import { Colors } from '../constants/Colors';

type Props = NativeStackScreenProps<DealsStackParamList, 'DealDetail'>;

export default function DealDetailScreen({ route }: Props) {
  const { dealId } = route.params;

  const { data: deal, isLoading, error } = useDealDetail(dealId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][date.getDay()];
    return `${dayName}, ${day} ${month} ${year}`;
  };

  const getRemainingDays = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Bugün sona eriyor', color: Colors.error };
    if (diffDays === 1) return { text: 'Yarın sona eriyor', color: Colors.error };
    if (diffDays < 7) return { text: `${diffDays} gün kaldı`, color: '#FFB800' };
    return { text: `${diffDays} gün kaldı`, color: Colors.primary };
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Kampanya yükleniyor...</Text>
      </View>
    );
  }

  if (error || !deal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Kampanya bulunamadı</Text>
      </View>
    );
  }

  const remainingInfo = getRemainingDays(deal.valid_until);

  const handlePhonePress = () => {
    if (deal.venues?.phone) {
      Linking.openURL(`tel:${deal.venues.phone}`);
    }
  };

  const handleLocationPress = () => {
    if (deal.venues?.location) {
      const query = encodeURIComponent(deal.venues.location);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Deal Image */}
      {deal.image_url ? (
        <Image source={{ uri: deal.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="pricetag" size={64} color={Colors.textTertiary} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{deal.title}</Text>

        {/* Remaining Days Badge */}
        <View style={[styles.remainingBadge, { backgroundColor: remainingInfo.color + '20' }]}>
          <Ionicons name="time-outline" size={20} color={remainingInfo.color} />
          <Text style={[styles.remainingText, { color: remainingInfo.color }]}>
            {remainingInfo.text}
          </Text>
        </View>

        {/* Venue Info */}
        {deal.venues && (
          <View style={styles.venueSection}>
            <View style={styles.venuHeader}>
              <Ionicons name="restaurant" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>İşletme</Text>
            </View>
            <View style={styles.venueCard}>
              <Text style={styles.venueName}>{deal.venues.name}</Text>
              {deal.venues.description && (
                <Text style={styles.venueDescription} numberOfLines={2}>
                  {deal.venues.description}
                </Text>
              )}
              {deal.venues.location && (
                <View style={styles.venueLocation}>
                  <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.venueLocationText}>{deal.venues.location}</Text>
                </View>
              )}

              {/* Actions */}
              {(deal.venues.phone || deal.venues.location) && (
                <View style={styles.venueActions}>
                  {deal.venues.phone && (
                    <TouchableOpacity style={styles.venueActionButton} onPress={handlePhonePress}>
                      <Ionicons name="call" size={20} color={Colors.primary} />
                      <Text style={styles.venueActionText}>Ara</Text>
                    </TouchableOpacity>
                  )}
                  {deal.venues.location && (
                    <TouchableOpacity style={styles.venueActionButton} onPress={handleLocationPress}>
                      <Ionicons name="location" size={20} color={Colors.primary} />
                      <Text style={styles.venueActionText}>Konum</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Date Range */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Başlangıç Tarihi</Text>
              <Text style={styles.infoValue}>{formatDate(deal.valid_from)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Bitiş Tarihi</Text>
              <Text style={styles.infoValue}>{formatDate(deal.valid_until)}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {deal.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Kampanya Detayları</Text>
            <Text style={styles.description}>{deal.description}</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.surfaceLight,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  remainingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  venueSection: {
    marginBottom: 16,
  },
  venuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  venueCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  venueDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  venueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueLocationText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  venueActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  venueActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 8,
  },
  venueActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  descriptionSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
