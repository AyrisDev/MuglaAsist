import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pharmacy } from '../types/database';
import { Colors } from '../constants/Colors';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  isOnDuty?: boolean;
}

export default function PharmacyCard({ pharmacy, isOnDuty = false }: PharmacyCardProps) {
  const handlePhonePress = () => {
    if (pharmacy.phone) {
      Linking.openURL(`tel:${pharmacy.phone}`);
    }
  };

  const handleLocationPress = () => {
    if (pharmacy.latitude && pharmacy.longitude) {
      Linking.openURL(
        `https://maps.google.com/?q=${pharmacy.latitude},${pharmacy.longitude}`
      );
    } else if (pharmacy.address) {
      const query = encodeURIComponent(pharmacy.address);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  return (
    <View style={[styles.container, isOnDuty && styles.onDutyContainer]}>
      {/* On Duty Badge */}
      {isOnDuty && (
        <View style={styles.onDutyBadge}>
          <Ionicons name="star" size={14} color={Colors.primary} />
          <Text style={styles.onDutyText}>Nöbetçi</Text>
        </View>
      )}

      {/* Pharmacy Info */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, isOnDuty && styles.onDutyIconContainer]}>
          <Ionicons name="medical" size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{pharmacy.name}</Text>
          {pharmacy.address && (
            <Text style={styles.address} numberOfLines={2}>
              {pharmacy.address}
            </Text>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {pharmacy.phone && (
          <TouchableOpacity style={styles.actionButton} onPress={handlePhonePress}>
            <Ionicons name="call" size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Ara</Text>
          </TouchableOpacity>
        )}
        {(pharmacy.latitude || pharmacy.address) && (
          <TouchableOpacity style={styles.actionButton} onPress={handleLocationPress}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Konum</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  onDutyContainer: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 2,
    borderColor: Colors.primary + '40',
  },
  onDutyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onDutyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  onDutyIconContainer: {
    backgroundColor: Colors.primary + '30',
  },
  headerText: {
    flex: 1,
    paddingRight: 60, // Space for badge
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
