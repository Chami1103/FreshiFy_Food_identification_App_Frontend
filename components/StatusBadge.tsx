import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isFresh = status.toLowerCase().includes("fresh");
  return (
    <View style={[styles.badge, isFresh ? styles.fresh : styles.spoiled]}>
      <Text style={styles.text}>{isFresh ? "Fresh" : "Spoiled"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  fresh: { backgroundColor: "#dcfce7" },
  spoiled: { backgroundColor: "#fee2e2" },
  text: { color: "#111827", fontWeight: "600", fontSize: 12 },
});
