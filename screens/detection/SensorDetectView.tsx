import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../config/config";
import ShimmerCard from "../../components/ShimmerCard";

export default function SensorDetectView() {
  const [nh3Level, setNh3Level] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSensor = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API.LIVE_NH3);
      const value = res.data?.nh3 || res.data?.NH3 || res.data?.value || null;
      setNh3Level(value);
      const pred = await axios.post(API.PREDICT_SENSOR, { nh3: value });
      setStatus(pred.data.prediction);
    } catch (error) {
      console.error("Sensor fetch failed:", error);
      Alert.alert("Error", "Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSensor();
    const interval = setInterval(fetchSensor, 5000);
    return () => clearInterval(interval);
  }, [fetchSensor]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSensor();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {loading ? (
        <>
          <ShimmerCard height={120} />
          <ShimmerCard height={80} />
        </>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Gas Sensor Detection</Text>

          <View style={styles.card}>
            <Ionicons name="speedometer" size={50} color="#2563eb" />
            <Text style={styles.label}>Current NH₃ Level</Text>
            <Text style={styles.value}>{nh3Level?.toFixed(2)} ppm</Text>

            <TouchableOpacity
              onPress={onRefresh}
              style={[styles.refreshButton, refreshing && { opacity: 0.5 }]}
              disabled={refreshing}
            >
              <Ionicons name="refresh" size={22} color="#2563eb" />
              <Text style={styles.refreshText}>
                {refreshing ? "Refreshing..." : "Refresh"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.predictButton} onPress={fetchSensor}>
            <Ionicons name="flask" size={22} color="#fff" />
            <Text style={styles.predictText}>Predict Spoilage</Text>
          </TouchableOpacity>

          {status && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Prediction Result</Text>
              <Text
                style={[
                  styles.resultText,
                  status.toLowerCase().includes("fresh")
                    ? styles.fresh
                    : styles.spoiled,
                ]}
              >
                {status}
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  content: { alignItems: "center", marginTop: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#1e293b", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: { fontSize: 16, color: "#64748b", marginTop: 10 },
  value: { fontSize: 28, fontWeight: "bold", color: "#2563eb", marginTop: 5 },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2563eb",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 15,
  },
  refreshText: { color: "#2563eb", fontWeight: "600", fontSize: 15, marginLeft: 8 },
  predictButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 30,
  },
  predictText: { color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 10 },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 25,
    alignItems: "center",
    elevation: 2,
  },
  resultTitle: { fontSize: 16, color: "#1e293b" },
  resultText: { fontSize: 20, fontWeight: "700", marginTop: 5 },
  fresh: { color: "#10b981" },
  spoiled: { color: "#ef4444" },
});
