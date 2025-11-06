// screens/HomeScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import Card from "../components/Card";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import {
  getStats,
  getHistory,
  getLastSensorScan,
  getLastImageScan,
  getPredictionHistory,
} from "../services/apiService";
import {
  StatsData,
  HistoryData,
  LastSensorData,
  LastImageData,
  PredictionHistoryItem,
} from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [lastSensor, setLastSensor] = useState<LastSensorData | null>(null);
  const [lastImage, setLastImage] = useState<LastImageData | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const scrollOffset = useRef(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset.current;
    if (Math.abs(diff) > 8) {
      setIsHeaderVisible(diff < 0 || currentOffset < 50);
      scrollOffset.current = currentOffset;
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, historyData, lastSensorData, lastImageData, predHistoryData] =
          await Promise.all([
            getStats(),
            getHistory(),
            getLastSensorScan(),
            getLastImageScan(),
            getPredictionHistory(),
          ]);
        if (!mounted) return;
        setStats(statsData ?? null);
        setHistory(historyData ?? []);
        setLastSensor(lastSensorData ?? null);
        setLastImage(lastImageData ?? null);
        setPredictionHistory(predHistoryData ?? []);
      } catch (err) {
        console.error("HomeScreen fetch error:", err);
        if (!mounted) return;
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Always render the app shell (Header & Tabs are in _layout) — show loader or error inside the content area.
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {/* content sits under header (header has absolute position) */}
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 80, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Loader during initial fetch */}
        {isLoading ? (
          <View style={styles.loaderWrap}>
            <Loader text="Loading Dashboard..." />
          </View>
        ) : error ? (
          <View style={styles.container}>
            <Card>
              <Text style={styles.errorText}>{error}</Text>
            </Card>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome to FreshiFy</Text>
              <Text style={styles.subtitle}>Your intelligent food monitoring dashboard.</Text>
            </View>

            {stats && (
              <Card>
                <Text style={styles.cardTitle}>Overall Stats</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.totalScans}</Text>
                    <Text style={styles.statLabel}>Total Scans</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: "#10b981" }]}>{stats.fresh}</Text>
                    <Text style={styles.statLabel}>Fresh Items</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: "#ef4444" }]}>{stats.spoiled}</Text>
                    <Text style={styles.statLabel}>Spoiled Items</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: "#059669" }]}>
                      {stats.freshnessPercentage}%
                    </Text>
                    <Text style={styles.statLabel}>Freshness Rate</Text>
                  </View>
                </View>
              </Card>
            )}

            <View style={styles.twoColumn}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Card>
                  <Text style={styles.cardTitle}>Last Sensor Scan</Text>
                  {lastSensor ? (
                    <View style={{ gap: 8 }}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.foodName}>{lastSensor.foodName}</Text>
                        <StatusBadge status={lastSensor.status} />
                      </View>
                      <Text style={styles.smallText}>NH₃: {lastSensor.nh3} ppm</Text>
                      <View style={styles.rowBetween}>
                        <Text style={styles.smallText}>Humidity: {lastSensor.humidity}%</Text>
                        <Text style={styles.smallText}>Temp: {lastSensor.temperature}°C</Text>
                      </View>
                    </View>
                  ) : (
                    <Text>No sensor scans yet.</Text>
                  )}
                </Card>
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Card>
                  <Text style={styles.cardTitle}>Last Image Scan</Text>
                  {lastImage ? (
                    <View style={styles.rowWithImage}>
                      <Image
                        source={{ uri: lastImage.imageUrl }}
                        style={styles.previewImage}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.foodName}>{lastImage.foodName}</Text>
                        <StatusBadge status={lastImage.status} />
                      </View>
                    </View>
                  ) : (
                    <Text>No image scans yet.</Text>
                  )}
                </Card>
              </View>
            </View>

            {history.length > 0 && (
              <Card>
                <Text style={styles.cardTitle}>Weekly NH₃ Average (ppm)</Text>
                {history.map((h, idx) => (
                  <View key={`${h.date}-${idx}`} style={styles.historyRow}>
                    <Text style={styles.smallText}>{h.date}</Text>
                    <Text style={styles.smallText}>{h.nh3_avg} ppm</Text>
                  </View>
                ))}
              </Card>
            )}

            {predictionHistory.length > 0 && (
              <Card>
                <Text style={styles.cardTitle}>Recent Scans</Text>
                {predictionHistory.map((item, idx) => (
                  <View key={`${item.id ?? idx}`} style={styles.predictionRow}>
                    <View style={styles.iconBox}>
                      <Text style={styles.iconText}>{item.type === "camera" ? "📷" : "📡"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.predTitle}>{item.foodName}</Text>
                      <Text style={styles.smallText}>
                        {new Date(item.timestamp).toLocaleString()}
                      </Text>
                    </View>
                    <StatusBadge status={item.status} />
                  </View>
                ))}
              </Card>
            )}
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loaderWrap: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80 },
  header: { alignItems: "center", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#10b981", marginTop: 6 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#b45309", marginBottom: 8 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  statItem: { width: "48%", paddingVertical: 8, alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 12, color: "#6b7280" },
  twoColumn: { flexDirection: "row", marginTop: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  foodName: { fontSize: 16, fontWeight: "700" },
  smallText: { color: "#6b7280", fontSize: 12 },
  previewImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#e5e7eb" },
  rowWithImage: { flexDirection: "row", alignItems: "center" },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.4,
    borderBottomColor: "#e6e6e6",
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.4,
    borderBottomColor: "#e6e6e6",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  iconText: { fontSize: 16 },
  predTitle: { fontSize: 14, fontWeight: "600" },
  errorText: { color: "#ef4444", textAlign: "center" },
});
