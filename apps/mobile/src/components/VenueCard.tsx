import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VenueWithCategory } from '../types/database';
import { Colors } from '../constants/Colors';

interface VenueCardProps {
  venue: VenueWithCategory;
  onPress: () => void;
}

export default function VenueCard({ venue, onPress }: VenueCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Venue Image */}
      <View style={styles.imageContainer}>
        {venue.logo_url ? (
          <Image source={{ uri: venue.logo_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="restaurant-outline" size={32} color={Colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {venue.name}
        </Text>

        <View style={styles.metaContainer}>
          {/* Rating */}
          {venue.rating && (
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={Colors.star} />
              <Text style={styles.metaText}>{venue.rating.toFixed(1)}</Text>
            </View>
          )}

          {/* Distance */}
          {venue.distance && (
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{venue.distance}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imagePlaceholder: {
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
