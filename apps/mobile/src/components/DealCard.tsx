import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { DealWithVenue } from '../types/database';

interface DealCardProps {
  deal: DealWithVenue;
  onPress?: () => void;
}

export default function DealCard({ deal, onPress }: DealCardProps) {
  // Calculate remaining days
  const getRemainingDaysText = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return 'Expires tomorrow';
    return `Expires in ${diffDays} days`;
  };

  const expiryText = getRemainingDaysText(deal.endDate);

  return (
    <View style={styles.container}>
      {/* Deal Image */}
      <View style={styles.imageContainer}>
        {deal.image ? (
          <Image source={{ uri: deal.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="pricetag" size={64} color={Colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.venueName}>
          {deal.venues?.name || 'Venue Name'}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {deal.title}
        </Text>

        {deal.description && (
          <Text style={styles.description} numberOfLines={3}>
            {deal.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.expiryText}>{expiryText}</Text>

          <TouchableOpacity
            style={styles.claimButton}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.claimButtonText}>Claim Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  venueName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  expiryText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  claimButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  claimButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
