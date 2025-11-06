// screens/AnalyticsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { getHistory, getStats } from "../services/apiService";

const AnalyticsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const [h, s] = await Promise.all([getHistory(), getStats()]);
      if (!mounted) return;
      setHistory(h ?? []);
      setStats(s ?? null);
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loader text="Loading analytics..." />;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Weekly NH₃ Overview</Text>
        <Text style={styles.p}>(Summary), data points: {history.length}</Text>
        {/* TODO: Replace with chart component (e.g., react-native-chart-kit or recharts via webview) */}
      </Card>

      <Card>
        <Text style={styles.title}>Stats</Text>
        <Text>Total scans: {stats?.totalScans ?? "—"}</Text>
        <Text>Fresh: {stats?.fresh ?? "—"}</Text>
        <Text>Spoiled: {stats?.spoiled ?? "—"}</Text>
      </Card>
    </View>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f8fafc" },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  p: { color: "#6b7280" },
});
