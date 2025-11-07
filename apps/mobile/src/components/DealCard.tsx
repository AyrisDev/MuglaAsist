import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Deal } from '../types/database';
import { Colors } from '../constants/Colors';

interface DealCardProps {
  deal: Deal;
  onPress?: () => void;
}

export default function DealCard({ deal, onPress }: DealCardProps) {
  // Format date (e.g., "15 Ara")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  // Calculate remaining days
  const getRemainingDays = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Bugün sona eriyor';
    if (diffDays === 1) return 'Yarın sona eriyor';
    if (diffDays < 7) return `${diffDays} gün kaldı`;
    return null;
  };

  const remainingDays = getRemainingDays(deal.valid_until);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Deal Image */}
      {deal.image_url ? (
        <Image source={{ uri: deal.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="pricetag" size={40} color={Colors.textSecondary} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {deal.title}
        </Text>

        {deal.description && (
          <Text style={styles.description} numberOfLines={2}>
            {deal.description}
          </Text>
        )}

        {/* Date Range */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
            <Text style={styles.metaText}>
              {formatDate(deal.valid_from)} - {formatDate(deal.valid_until)}
            </Text>
          </View>
        </View>

        {/* Remaining Days Badge */}
        {remainingDays && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={12} color={Colors.primary} />
              <Text style={styles.badgeText}>{remainingDays}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  imagePlaceholder: {
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  badgeContainer: {
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
});
