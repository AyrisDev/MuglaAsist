import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import type { FoodHomeScreenProps } from "../types/navigation";

export default function FoodHomeScreen({ navigation }: FoodHomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Yeme-İçme</Text>
          <Text style={styles.subtitle}>
            Kampüsteki tüm restoranlar ve kafeler
          </Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Kategoriler ve mekanlar burada görünecek
          </Text>
          <Text style={styles.placeholderSubtext}>
            Supabase'den categories ve venues çekilecek
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Özellikler (MVP):</Text>
          <Text style={styles.infoItem}>• Kategori listesi</Text>
          <Text style={styles.infoItem}>• Mekan listesi (filtreleme)</Text>
          <Text style={styles.infoItem}>• Mekan detay (menü, harita)</Text>
          <Text style={styles.infoItem}>• Açık/kapalı durumu</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  placeholder: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#dbeafe",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: "#1e3a8a",
    marginBottom: 4,
  },
});
