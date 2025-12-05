import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Event } from '../types/database';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  // Format date (e.g., "Fri, Oct 28 • 7:00 PM")
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${dayName}, ${monthName} ${day} • ${hours}:${minutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      {/* Event Image */}
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.image} resizeMode="stretch" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="calendar" size={64} color={Colors.textSecondary} />
          </View>
        )}

        {/* Gradient Overlay for Text Readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
      </View>

      {/* Content Overlay */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.name}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          {formatDateTime(event.date)} • {event.location || 'TBA'}
        </Text>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
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
    height: 520, // Increased height for taller poster look
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
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
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%', // Gradient covers bottom 60%
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  metaText: {
    fontSize: 14,
    color: '#e0e0e0', // Light grey for readability on dark
    marginBottom: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: '#fff', // White text on orange button
    fontSize: 16,
    fontWeight: 'bold',
  },
});
