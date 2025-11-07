import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../navigation/EventsStackNavigator';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import { Colors } from '../constants/Colors';

type Props = NativeStackScreenProps<EventsStackParamList, 'Geri'>;

export default function EventsScreen({ navigation }: Props) {
  const { data: events, isLoading, error } = useEvents({ upcoming: true });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Etkinlikler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Bir hata oluştu</Text>
          <Text style={styles.errorSubtext}>{(error as Error).message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Etkinlikler</Text>
        <Text style={styles.subtitle}>Yaklaşan kampüs etkinlikleri</Text>
      </View>

      {/* Events List */}
      {events && events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => {
                navigation.navigate('EventDetail', { eventId: item.id });
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Yaklaşan etkinlik bulunmuyor</Text>
          <Text style={styles.emptySubtext}>
            Yeni etkinlikler eklendiğinde burada görünecek
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
