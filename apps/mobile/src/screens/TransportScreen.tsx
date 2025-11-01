import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import type { TransportScreenProps } from "../types/navigation";

export default function TransportScreen({ navigation }: TransportScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Ulaşım</Text>
          <Text style={styles.subtitle}>Ring ve merkez otobüs saatleri</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Ring otobüs saatleri burada görünecek
          </Text>
          <Text style={styles.placeholderSubtext}>
            services_data tablosundan data_key: "bus_ring"
          </Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Merkez otobüs saatleri burada görünecek
          </Text>
          <Text style={styles.placeholderSubtext}>
            services_data tablosundan data_key: "bus_center"
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Özellikler:</Text>
          <Text style={styles.infoItem}>• Ring otobüs saatleri</Text>
          <Text style={styles.infoItem}>• Merkez otobüs saatleri</Text>
          <Text style={styles.infoItem}>• Markdown içerik desteği</Text>
          <Text style={styles.infoItem}>• Gerçek zamanlı güncellemeler</Text>
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
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: "#78350f",
    marginBottom: 4,
  },
});
