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
import { useEventDetail } from '../hooks/useEvents';
import { EventsStackParamList } from '../navigation/EventsStackNavigator';
import { Colors } from '../constants/Colors';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventDetail'>;

export default function EventDetailScreen({ route }: Props) {
  const { eventId } = route.params;

  const { data: event, isLoading, error } = useEventDetail(eventId);

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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handlePhonePress = () => {
    if (event?.venues?.phone) {
      Linking.openURL(`tel:${event.venues.phone}`);
    }
  };

  const handleLocationPress = () => {
    if (event?.location) {
      const query = encodeURIComponent(event.location);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  const handleVenueLocationPress = () => {
    if (event?.venues?.location) {
      const query = encodeURIComponent(event.venues.location);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Etkinlik yükleniyor...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Etkinlik bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Event Image */}
      {event.poster_url ? (
        <Image source={{ uri: event.poster_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="calendar" size={64} color={Colors.textTertiary} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{event.title}</Text>

        {/* Date & Time */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Tarih</Text>
              <Text style={styles.infoValue}>{formatDate(event.event_date)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Saat</Text>
              <Text style={styles.infoValue}>{formatTime(event.event_date)}</Text>
            </View>
          </View>

          {event.location && (
            <TouchableOpacity style={styles.infoRow} onPress={handleLocationPress}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Konum</Text>
                <Text style={styles.infoValue}>{event.location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Venue Info */}
        {event.venues && (
          <View style={styles.venueSection}>
            <View style={styles.venuHeader}>
              <Ionicons name="business" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Mekan</Text>
            </View>
            <View style={styles.venueCard}>
              <Text style={styles.venueName}>{event.venues.name}</Text>
              {event.venues.description && (
                <Text style={styles.venueDescription} numberOfLines={2}>
                  {event.venues.description}
                </Text>
              )}
              {event.venues.location && (
                <View style={styles.venueLocation}>
                  <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.venueLocationText}>{event.venues.location}</Text>
                </View>
              )}

              {/* Actions */}
              {(event.venues.phone || event.venues.location) && (
                <View style={styles.venueActions}>
                  {event.venues.phone && (
                    <TouchableOpacity style={styles.venueActionButton} onPress={handlePhonePress}>
                      <Ionicons name="call" size={20} color={Colors.primary} />
                      <Text style={styles.venueActionText}>Ara</Text>
                    </TouchableOpacity>
                  )}
                  {event.venues.location && (
                    <TouchableOpacity style={styles.venueActionButton} onPress={handleVenueLocationPress}>
                      <Ionicons name="location" size={20} color={Colors.primary} />
                      <Text style={styles.venueActionText}>Konum</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Description */}
        {event.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{event.description}</Text>
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
    marginBottom: 20,
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
