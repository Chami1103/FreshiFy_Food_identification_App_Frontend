// screens/CostScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { API } from "../config/config";

const fetchSummary = async () => {
  try {
    const res = await fetch(API.CALCULATOR_SUMMARY);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};

const CostScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const s = await fetchSummary();
      if (!mounted) return;
      setSummary(s);
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loader text="Loading cost summary..." />;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Monthly Summary</Text>
        <Text>Current total cost: {summary?.currentTotalCost ?? "—"}</Text>
        <Text>Total bonus: {summary?.totalBonus ?? "—"}</Text>
        <Text>Net amount: {summary?.netAmount ?? "—"}</Text>
      </Card>
    </View>
  );
};

export default CostScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f8fafc" },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
});
