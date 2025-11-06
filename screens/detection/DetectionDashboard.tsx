//E:\FreshiFy_Mobile_App_Frontend\screens\detection\DetectionDashboard.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Header from "@/components/Header"; // ✅ alias import (preferred)
import Card from "@/components/Card";
import Loader from "@/components/Loader";

export default function AnalyticsScreen() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollOffset = useRef(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset.current;
    if (Math.abs(diff) > 8) {
      setIsHeaderVisible(diff < 0 || currentOffset < 50);
      scrollOffset.current = currentOffset;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <Header isHeaderVisible={isHeaderVisible} />
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 80, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <Text style={styles.title}>📊 Analytics Overview</Text>
        <Text style={styles.subtitle}>Visualize food spoilage trends and NH₃ levels.</Text>

        <Card>
          <Text style={styles.sectionTitle}>NH₃ Sensor Trends</Text>
          <Text style={styles.placeholder}>📈 Chart placeholder – integrate later</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Prediction Accuracy</Text>
          <Text style={styles.placeholder}>⚙️ Model Performance Data</Text>
        </Card>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#2563eb", marginBottom: 6 },
  placeholder: { fontSize: 14, color: "#6b7280", textAlign: "center" },
});
