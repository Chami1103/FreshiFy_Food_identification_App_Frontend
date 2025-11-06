import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API } from "../../config/config";
import ShimmerCard from "../../components/ShimmerCard";

export default function DetectView() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCameraCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      uploadImage(uri);
    }
  };

  const handleGalleryPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Gallery access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setLoading(true);
      setPrediction(null);

      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      const response = await axios.post(API.PREDICT_IMAGE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 20000,
      });

      const result = response.data?.prediction || "Unknown";
      setPrediction(result);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to connect to server. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setImageUri(null);
    setPrediction(null);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Food Freshness Detection</Text>

      {loading ? (
        <>
          <ShimmerCard height={260} />
          <ShimmerCard height={80} />
        </>
      ) : (
        <>
          <View style={styles.imageBox}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Ionicons name="image-outline" size={100} color="#cbd5e1" />
            )}
          </View>

          <TouchableOpacity style={styles.buttonCamera} onPress={handleCameraCapture}>
            <Ionicons name="camera" size={22} color="#fff" />
            <Text style={styles.buttonText}>Scan Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonGallery} onPress={handleGalleryPick}>
            <Ionicons name="images" size={22} color="#2563eb" />
            <Text style={styles.buttonTextAlt}>Upload Image</Text>
          </TouchableOpacity>
        </>
      )}

      {prediction && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Prediction Result</Text>
          <Text
            style={[
              styles.resultText,
              prediction.toLowerCase().includes("fresh")
                ? styles.fresh
                : styles.spoiled,
            ]}
          >
            {prediction}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#1e293b", marginBottom: 15, textAlign: "center" },
  imageBox: {
    width: 260,
    height: 260,
    backgroundColor: "#e2e8f0",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    alignSelf: "center",
  },
  image: { width: "100%", height: "100%" },
  buttonCamera: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonGallery: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderColor: "#2563eb",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    alignSelf: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 10 },
  buttonTextAlt: { color: "#2563eb", fontWeight: "600", fontSize: 16, marginLeft: 10 },
  resultBox: { marginTop: 25, alignItems: "center" },
  resultTitle: { fontSize: 18, color: "#1e293b", fontWeight: "600" },
  resultText: { fontSize: 20, fontWeight: "700", marginTop: 5 },
  fresh: { color: "#10b981" },
  spoiled: { color: "#ef4444" },
});
