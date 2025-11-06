// screens/detection/SelectionView.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraIcon, RssIcon } from "../../components/icons/Icons";

interface SelectionViewProps {
  setMode: (mode: "sensor" | "camera") => void;
}

const SelectionView: React.FC<SelectionViewProps> = ({ setMode }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.optionBox}
        onPress={() => setMode("sensor")}
      >
        <RssIcon width={48} height={48} color="#0ea5e9" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.title}>Sensor Scan</Text>
          <Text style={styles.subtitle}>Get real-time data from your FreshiFy device.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.optionBox}
        onPress={() => setMode("camera")}
      >
        <CameraIcon width={48} height={48} color="#eab308" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.title}>Camera Scan</Text>
          <Text style={styles.subtitle}>Analyze food freshness from an image.</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SelectionView;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 16 },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6b7280", marginTop: 4 },
});
