import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LifeStackParamList } from '../navigation/LifeStackNavigator';
import { Colors } from '../constants/Colors';

type Props = NativeStackScreenProps<LifeStackParamList, 'Geri'>;

interface LifeCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: keyof LifeStackParamList;
}

const categories: LifeCategory[] = [
  {
    id: 'pharmacies',
    title: 'Eczaneler',
    icon: 'medical',
    screen: 'Pharmacies',
  },

  {
    id: 'bus',
    title: 'Otobüs Saatleri',
    icon: 'bus',
    screen: 'BusSchedule',
  },

];

export default function LifeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Yaşam</Text>
        <Text style={styles.subtitle}>Kampüs yaşamı için her şey</Text>
      </View>

      {/* Categories Grid */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => navigation.navigate(category.screen as any)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={category.icon} size={32} color={Colors.primary} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  content: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
});
