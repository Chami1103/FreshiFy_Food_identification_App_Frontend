import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { analyzeImages } from "../../services/apiService";
import { AnalyzedImage, PredictionCardData } from "../../types";
import { useNotifications } from "../../contexts/NotificationContext";

const CameraScanView: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const { addNotification } = useNotifications();
  const [images, setImages] = useState<AnalyzedImage[]>([]);
  const [predictions, setPredictions] = useState<PredictionCardData[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async (source: "camera" | "gallery") => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    };
    let result;
    if (source === "camera") result = await ImagePicker.launchCameraAsync(options);
    else result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImage = {
        id: `${Date.now()}`,
        file: result.assets[0],
        preview: result.assets[0].uri,
      } as any;
      setImages((prev) => [...prev, newImage].slice(0, 4));
    }
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      Alert.alert("No images", "Please select at least one image.");
      return;
    }

    setLoading(true);
    try {
      const files = images.map((i) => i.file);
      const results = await analyzeImages(files);

      const newPredictions: PredictionCardData[] = images.map((img, i) => {
        const result = results[i] || { foodName: "Unknown", status: "Spoiled" };
        const cleanStatus: "Fresh" | "Spoiled" =
          result.status === "Fresh" ? "Fresh" : "Spoiled"; // ✅ strict type

        if (cleanStatus === "Spoiled") {
          addNotification({
            type: "spoiled_alert",
            title: "Spoiled Item Detected",
            message: `${result.foodName} detected as spoiled.`,
          });
        }

        return {
          id: `${Date.now()}-${i}`,
          foodName: result.foodName,
          status: cleanStatus,
          imagePreview: img.preview,
          timestamp: new Date().toLocaleString(),
        };
      });

      setPredictions(newPredictions);
      setImages([]);
    } catch (e) {
      addNotification({
        type: "error",
        title: "Analysis Failed",
        message: "Image analysis failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Card>
        <Text style={styles.title}>Batch Image Analysis</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#0ea5e9" }]}
            onPress={() => pickImage("camera")}
            disabled={images.length >= 4}
          >
            <Text style={styles.buttonText}>Scan Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#f59e0b" }]}
            onPress={() => pickImage("gallery")}
            disabled={images.length >= 4}
          >
            <Text style={styles.buttonText}>Upload Images</Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={styles.previewGrid}>
            {images.map((img) => (
              <Image key={img.id} source={{ uri: img.preview }} style={styles.previewImage} />
            ))}
          </View>
        )}

        {images.length > 0 && (
          <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze}>
            <Text style={styles.analyzeText}>
              {loading ? "Analyzing..." : `Analyze ${images.length} Image(s)`}
            </Text>
          </TouchableOpacity>
        )}
      </Card>

      {loading && <Loader text="Analyzing images..." />}

      {predictions.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.resultTitle}>Analysis Results</Text>
          {predictions.map((pred) => (
            <Card key={pred.id}>
              <View style={styles.resultRow}>
                <Image
                  source={{ uri: pred.imagePreview }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.foodName}>{pred.foodName}</Text>
                  <StatusBadge status={pred.status} />
                  <Text style={styles.timestamp}>{pred.timestamp}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default CameraScanView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  backText: { color: "#059669", fontSize: 16, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  button: { flex: 1, marginHorizontal: 4, borderRadius: 8, paddingVertical: 12 },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  previewGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  previewImage: { width: "48%", aspectRatio: 1, borderRadius: 8 },
  analyzeBtn: { backgroundColor: "#059669", borderRadius: 8, marginTop: 10, paddingVertical: 12 },
  analyzeText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  resultTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  resultRow: { flexDirection: "row", alignItems: "center" },
  resultImage: { width: 80, height: 80, borderRadius: 8 },
  foodName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  timestamp: { fontSize: 11, color: "#6b7280", marginTop: 4 },
});
