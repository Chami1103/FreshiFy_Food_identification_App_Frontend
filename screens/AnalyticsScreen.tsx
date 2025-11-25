// screens/AnalyticsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { getHistory, getStats } from "../services/apiService";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface Stats {
  totalScans: number;
  freshCount: number;
  spoiledCount: number;
}

interface HistoryItem {
  id: string;
  type: "sensor" | "image";
  status?: string;
  nh3?: number;
  createdAt: string;
}

type Period = "week" | "month" | "year";

const AnalyticsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalScans: 0, freshCount: 0, spoiledCount: 0 });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [h, s] = await Promise.all([getHistory(), getStats()]);
      setHistory(h ?? []);
      setStats(s ?? { totalScans: 0, freshCount: 0, spoiledCount: 0 });
    } catch (error) {
      console.error("Analytics load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Calculate NH3 levels over time for line chart
  const getNH3ChartData = () => {
    const sensorData = history
      .filter((item) => item.type === "sensor" && item.nh3)
      .slice(0, 7)
      .reverse();

    if (sensorData.length === 0) {
      return {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
      };
    }

    const labels = sensorData.map((_, i) => `Day ${i + 1}`);
    const data = sensorData.map((item) => item.nh3 || 0);

    return {
      labels,
      datasets: [{ data }],
    };
  };

  // Fresh vs Spoiled pie chart data
  const getPieChartData = () => {
    return [
      {
        name: "Fresh",
        population: stats.freshCount || 1,
        color: "#10b981",
        legendFontColor: "#1e293b",
        legendFontSize: 14,
      },
      {
        name: "Spoiled",
        population: stats.spoiledCount || 1,
        color: "#ef4444",
        legendFontColor: "#1e293b",
        legendFontSize: 14,
      },
    ];
  };

  // Daily scan count for bar chart (mock data - adjust based on your needs)
  const getBarChartData = () => {
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{ data: [12, 19, 15, 22, 18, 25, 20] }],
    };
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#f8fafc",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#2563eb",
    },
  };

  if (loading && history.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#dbeafe" }]}>
          <Ionicons name="analytics" size={28} color="#2563eb" />
          <Text style={styles.statValue}>{stats.totalScans}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#d1fae5" }]}>
          <Ionicons name="checkmark-circle" size={28} color="#10b981" />
          <Text style={styles.statValue}>{stats.freshCount}</Text>
          <Text style={styles.statLabel}>Fresh Items</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#fee2e2" }]}>
          <Ionicons name="close-circle" size={28} color="#ef4444" />
          <Text style={styles.statValue}>{stats.spoiledCount}</Text>
          <Text style={styles.statLabel}>Spoiled Items</Text>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(["week", "month", "year"] as Period[]).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NH3 Levels Line Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="trending-up" size={20} color="#2563eb" />
          <Text style={styles.chartTitle}>NH₃ Levels Over Time</Text>
        </View>
        <Text style={styles.chartSubtitle}>Ammonia concentration (ppm)</Text>
        <LineChart
          data={getNH3ChartData()}
          width={SCREEN_WIDTH - 48}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          yAxisSuffix=" ppm"
        />
      </View>

      {/* Fresh vs Spoiled Pie Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="pie-chart" size={20} color="#2563eb" />
          <Text style={styles.chartTitle}>Fresh vs Spoiled Distribution</Text>
        </View>
        <Text style={styles.chartSubtitle}>Overall detection results</Text>
        <PieChart
          data={getPieChartData()}
          width={SCREEN_WIDTH - 48}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      {/* Daily Scans Bar Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="bar-chart" size={20} color="#2563eb" />
          <Text style={styles.chartTitle}>Daily Scan Activity</Text>
        </View>
        <Text style={styles.chartSubtitle}>Number of scans per day</Text>
        <BarChart
          data={getBarChartData()}
          width={SCREEN_WIDTH - 48}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisSuffix=" scans"
          showValuesOnTopOfBars
        />
      </View>

      {/* Accuracy Metrics */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="speedometer" size={20} color="#2563eb" />
          <Text style={styles.chartTitle}>Model Performance</Text>
        </View>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>94.5%</Text>
            <Text style={styles.metricLabel}>Accuracy</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>92.1%</Text>
            <Text style={styles.metricLabel}>Precision</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>96.3%</Text>
            <Text style={styles.metricLabel}>Recall</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>0.8s</Text>
            <Text style={styles.metricLabel}>Avg Response</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: "#2563eb",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  periodTextActive: {
    color: "#ffffff",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginLeft: 8,
  },
  chartSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  metricItem: {
    width: "48%",
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563eb",
  },
  metricLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
});