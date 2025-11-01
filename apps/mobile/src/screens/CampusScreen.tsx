import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import type { CampusScreenProps } from "../types/navigation";

export default function CampusScreen({ navigation }: CampusScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Kampüs</Text>
          <Text style={styles.subtitle}>Yemekhane ve kampüs hizmetleri</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Yemekhane menüsü burada görünecek
          </Text>
          <Text style={styles.placeholderSubtext}>
            services_data tablosundan data_key: "cafeteria_menu"
          </Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Kampüs duyuruları burada görünecek
          </Text>
          <Text style={styles.placeholderSubtext}>
            Opsiyonel: Faz 3'te events tablosu
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Özellikler:</Text>
          <Text style={styles.infoItem}>• Günlük yemekhane menüsü</Text>
          <Text style={styles.infoItem}>• Kampüs etkinlikleri (Faz 3)</Text>
          <Text style={styles.infoItem}>• Kampüs duyuruları</Text>
          <Text style={styles.infoItem}>• Markdown içerik desteği</Text>
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
    fontSize: 16,
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
    backgroundColor: "#d1fae5",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: "#064e3b",
    marginBottom: 4,
  },
});
