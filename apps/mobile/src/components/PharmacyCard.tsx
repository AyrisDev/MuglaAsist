import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Pharmacy } from '../types/database';

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
    <View style={styles.container}>
      {/* Left Side: Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {pharmacy.name}
        </Text>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: isOnDuty ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {isOnDuty ? 'Open • Nöbetçi Eczane' : 'Closed • 08:30 - 18:30'}
          </Text>
        </View>

        {/* Address */}
        {pharmacy.address && (
          <Text style={styles.address} numberOfLines={1}>
            {pharmacy.address}
          </Text>
        )}
      </View>

      {/* Right Side: Actions */}
      <View style={styles.actionsContainer}>
        {pharmacy.phone && (
          <TouchableOpacity style={styles.callButton} onPress={handlePhonePress}>
            <Ionicons name="call" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.directionButton} onPress={handleLocationPress}>
          <Ionicons name="navigate" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoContainer: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  address: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
