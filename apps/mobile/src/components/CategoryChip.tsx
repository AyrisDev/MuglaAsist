import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../types/database';
import { Colors } from '../constants/Colors';

interface CategoryChipProps {
  category: Category;
  isActive?: boolean;
  onPress: () => void;
}

export default function CategoryChip({ category, isActive = false, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onPress={onPress}
    >
      <Text style={[styles.name, isActive && styles.nameActive]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    marginRight: 12,
  },
  containerActive: {
    backgroundColor: Colors.primary,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  nameActive: {
    color: Colors.text,
  },
});
