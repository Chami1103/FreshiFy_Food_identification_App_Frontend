import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { getLastSensorScan, getLastImageScan, getHistory } from "../services/apiService";
import { LastSensorData, LastImageData, HistoryData } from "../types";
import StatusBadge from "../components/StatusBadge";

const ShelfScreen: React.FC = () => {
  const [sensorData, setSensorData] = useState<LastSensorData | null>(null);
  const [imageData, setImageData] = useState<LastImageData | null>(null);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadShelfData = async () => {
    const [sensor, image, hist] = await Promise.all([
      getLastSensorScan(),
      getLastImageScan(),
      getHistory(),
    ]);
    setSensorData(sensor ?? null);
    setImageData(image ?? null);
    setHistory(hist ?? []);
  };

  useEffect(() => {
    loadShelfData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadShelfData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Card>
              <Text style={styles.title}>🍇 Latest Shelf Scans</Text>
              {sensorData && (
                <>
                  <Text>Sensor: {sensorData.foodName}</Text>
                  <StatusBadge status={sensorData.status} />
                  <Text>NH₃: {sensorData.nh3} ppm</Text>
                </>
              )}
              {imageData && (
                <>
                  <Text>Image: {imageData.foodName}</Text>
                  <StatusBadge status={imageData.status} />
                </>
              )}
            </Card>

            <Card>
              <Text style={styles.title}>📊 Weekly NH₃ Averages</Text>
              {history.map((h, i) => (
                <View key={i} style={styles.row}>
                  <Text>{h.date}</Text>
                  <Text>{h.nh3_avg} ppm</Text>
                </View>
              ))}
            </Card>
          </>
        }
        data={[]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={null}
        ListEmptyComponent={<Loader text="Loading shelf data..." />}
      />
    </View>
  );
};

export default ShelfScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 12 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#0f172a" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.4,
    borderBottomColor: "#e5e7eb",
  },
});
