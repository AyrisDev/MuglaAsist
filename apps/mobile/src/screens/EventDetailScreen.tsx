import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useEventDetail } from '../hooks/useEvents';
import { EventsStackParamList } from '../navigation/EventsStackNavigator';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventDetail'>;

const { width } = Dimensions.get('window');

export default function EventDetailScreen({ route, navigation }: Props) {
  const { eventId } = route.params;
  const { data: event, isLoading, error } = useEventDetail(eventId);
  const { t } = useTranslation();

  // Format date (e.g., "Oct 26, 2024 | 9:00 AM - 5:00 PM")
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      t('events.months.jan'), t('events.months.feb'), t('events.months.mar'),
      t('events.months.apr'), t('events.months.may'), t('events.months.jun'),
      t('events.months.jul'), t('events.months.aug'), t('events.months.sep'),
      t('events.months.oct'), t('events.months.nov'), t('events.months.dec')
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day} ${month} ${year} | ${hours}:${minutes} ${ampm}`;
  };

  const handleCall = () => {
    if (event?.venues?.phonenumber) {
      Linking.openURL(`tel:${event.venues.phonenumber}`);
    } else {
      Alert.alert(t('alerts.info'), t('events.noPhone'));
    }
  };

  // Random coordinates for now as requested
  const randomLat = 37.167;
  const randomLng = 28.367;

  const handleOpenMap = () => {
    // Use event location query if available, otherwise use random coords
    const query = event?.location
      ? encodeURIComponent(event.location)
      : `${randomLat},${randomLng}`;
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('events.notFound')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('events.eventDetail')}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-social-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Event Image */}
        <View style={styles.imageContainer}>
          {event.image ? (
            <Image source={{ uri: event.image }} style={styles.image} resizeMode="stretch" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="calendar" size={64} color={Colors.textTertiary} />
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{event.name}</Text>

        {/* Info Container */}
        <View style={styles.infoContainer}>
          {/* Date */}
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.infoText}>{formatDateTime(event.date)}</Text>
          </View>

          {/* Venue Name */}
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="business" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.infoText}>{event.venues?.name || t('events.noVenue')}</Text>
          </View>

          {/* Location */}
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.infoText}>{event.location || t('events.noLocation')}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.callButtonText}>{t('common.call')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={styles.calendarButtonText}>{t('common.addToCalendar')}</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('events.aboutEvent')}</Text>
          <Text style={styles.description}>
            {event.description || t('events.noDescription')}
          </Text>
        </View>

        {/* Map Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('common.location')}</Text>
          <View style={styles.mapCard}>
            {/* Placeholder for Map */}
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={48} color={Colors.textTertiary} />
              <Text style={styles.mapPlaceholderText}>{t('events.mapView')}</Text>
            </View>
            <TouchableOpacity style={styles.openMapButton} onPress={handleOpenMap}>
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.openMapText}>{t('common.openInMap')}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
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
    paddingTop: 50, // Safe area top
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  iconButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: width - 32,
    height: 450,
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 20,
    lineHeight: 34,
  },
  infoContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  callButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  calendarButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  mapCard: {
    height: 200,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    alignItems: 'center',
    opacity: 0.5,
  },
  mapPlaceholderText: {
    color: Colors.textSecondary,
    marginTop: 8,
  },
  openMapButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  openMapText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
