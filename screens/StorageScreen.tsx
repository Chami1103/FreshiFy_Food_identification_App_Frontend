import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";
import { getStats, getLastSensorScan } from "../services/apiService";

const StorageScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any | null>(null);
  const [sensor, setSensor] = useState<any | null>(null);

  const loadStorage = async () => {
    try {
      setLoading(true);
      const [s, l] = await Promise.all([getStats(), getLastSensorScan()]);
      setStats(s ?? null);
      setSensor(l ?? null);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to load storage data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorage();
  }, []);

  if (loading) return <Loader text="Monitoring storage..." />;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Smart Storage Conditions</Text>
        <Text>Fresh items: {stats?.fresh}</Text>
        <Text>Spoiled items: {stats?.spoiled}</Text>
        <Text>Freshness Rate: {stats?.freshnessPercentage}%</Text>
      </Card>

      <Card>
        <Text style={styles.title}>Latest Sensor Update</Text>
        <Text>Food: {sensor?.foodName}</Text>
        <Text>NH₃: {sensor?.nh3} ppm</Text>
        <Text>Temp: {sensor?.temperature}°C</Text>
        <Text>Humidity: {sensor?.humidity}%</Text>
      </Card>

      <Card>
        <Text style={styles.title}>⚠️ Storage Recommendations</Text>
        <Text>
          {sensor?.nh3 > 50
            ? "High gas detected! Isolate ethylene-producing foods."
            : "All items stored optimally."}
        </Text>
      </Card>
    </View>
  );
};

export default StorageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 12 },
  title: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginBottom: 6 },
});
