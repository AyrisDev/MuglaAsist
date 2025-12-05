import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MenuItem from '../components/MenuItem';
import { Colors } from '../constants/Colors';
import { useVenueDetail } from '../hooks/useVenueDetail';
import { FoodStackParamList } from '../navigation/FoodStackNavigator';
import { MenuItem as MenuItemType } from '../types/database';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<FoodStackParamList, 'VenueDetail'>;

export default function VenueDetailScreen({ route, navigation }: Props) {
  const { venueId } = route.params;
  const { data: venue, isLoading, error } = useVenueDetail(venueId) || {};

  const handleCall = () => {
    if (venue?.phonenumber) {
      Linking.openURL(`tel:${venue.phonenumber}`);
    }
  };

  const handleMap = () => {
    if (venue?.location) {
      const query = encodeURIComponent(venue.location);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  // Group menu items by category
  const menuSections = useMemo(() => {
    if (!venue || !venue.menus || venue.menus.length === 0) {
      return [];
    }

    const grouped = venue.menus.reduce((acc: { [key: string]: MenuItemType[] }, item: MenuItemType) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as { [key: string]: MenuItemType[] });

    return Object.keys(grouped).map(title => ({
      title: title,
      data: grouped[title],
    }));
  }, [venue]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !venue) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Venue not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back and Favorite */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          {venue.cover_image ? (
            <Image source={{ uri: venue.cover_image }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={[styles.coverImage, styles.coverPlaceholder]}>
              <Ionicons name="image-outline" size={64} color={Colors.textTertiary} />
            </View>
          )}

          {/* Venue Name Overlay */}
          <View style={styles.overlayInfo}>
            <Text style={styles.venueName}>{venue.name}</Text>
            {venue.openedclosetime && (
              <View style={styles.openBadge}>
                <Text style={styles.openBadgeText}>{venue.openedclosetime}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapButton} onPress={handleMap}>
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>Map</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuSections && menuSections.length > 0 && (
          <View style={styles.menuContainer}>
            {menuSections.map((section) => (
              <View key={section.title} style={styles.menuSection}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.data.map((item: MenuItemType) => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Empty state */}
        {(!menuSections || menuSections.length === 0) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  headerBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  venueName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  openBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  openBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  menuSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});