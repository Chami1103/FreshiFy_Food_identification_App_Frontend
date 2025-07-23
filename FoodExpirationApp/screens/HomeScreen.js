import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView, ActivityIndicator, Platform as RNPlatform } from 'react-native';
import { MaterialCommunityIcons, Feather, Octicons, Ionicons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// --- PC IP for Expo Go/mobile access ---
const PC_IP = "192.168.8.102";
const BACKEND_URL =
  RNPlatform.OS === 'web'
    ? "http://localhost:5000/predict"
    : `http://${PC_IP}:5000/predict`;

export default function FoodSpoilageApp() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [isScanning, setIsScanning] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleScan = async (type) => {
    if (type === 'image') {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access camera roll is required!");
        return;
      }
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
      if (pickerResult.cancelled) return;

      setUploading(true);
      setPrediction(null);

      let localUri = pickerResult.assets ? pickerResult.assets[0].uri : pickerResult.uri;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let typeImage = match ? `image/${match[1]}` : `image`;

      let formData = new FormData();
      formData.append('file', { uri: localUri, name: filename, type: typeImage });

      try {
        const response = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        });
        const result = await response.json();
        setPrediction(result);
        Alert.alert('Prediction', `Fruit: ${result.fruit}\nStatus: ${result.status}`);
      } catch (error) {
        alert("Failed to upload image or connect to backend");
      } finally {
        setUploading(false);
      }
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (type === 'sensor') {
        setAlertVisible(true);
        setCurrentScreen('alert');
      }
    }, 2000);
  };

  const MainScreen = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>🥗 FreshGuard</Text>
        <Text style={styles.subtitle}>Last scan: 2 minutes ago</Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity style={styles.detectCard} onPress={() => handleScan('image')}>
          <View style={[styles.iconCircle, { backgroundColor: '#dbeafe' }]}>
            <MaterialCommunityIcons name="camera" size={26} color="#2563eb" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>📷 Image Detect</Text>
            <Text style={styles.cardDesc}>Snap or pick a photo to analyze</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.detectCard} onPress={() => handleScan('sensor')}>
          <View style={[styles.iconCircle, { backgroundColor: '#ede9fe' }]}>
            <Feather name="wind" size={26} color="#7c3aed" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>🔬 Sensor Detect</Text>
            <Text style={styles.cardDesc}>Use gas sensor analysis</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
      </View>

      {uploading && <ActivityIndicator size="large" color="#059669" style={{ marginTop: 8 }} />}
      {prediction && (
        <View style={{ backgroundColor: "#f0fdf4", padding: 14, borderRadius: 10, marginTop: 14, width: "100%" }}>
          <Text style={{ color: "#16a34a", fontWeight: "bold", fontSize: 16 }}>Prediction Result:</Text>
          <Text style={{ fontSize: 15, marginTop: 6 }}>Fruit: <Text style={{ fontWeight: "bold" }}>{prediction.fruit}</Text></Text>
          <Text style={{ fontSize: 15 }}>Status: <Text style={{ fontWeight: "bold" }}>{prediction.status}</Text></Text>
        </View>
      )}

      <View style={styles.statusPanel}>
        <Text style={styles.statusHeading}>Current Food Status</Text>
        <View style={styles.freshRow}>
          <FontAwesome name="check-circle" size={24} color="#16a34a" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.freshText}>Apple - Fresh</Text>
            <Text style={styles.freshScore}>Freshness Score: 92/100</Text>
          </View>
          <View style={styles.greenDot} />
        </View>
        <View style={styles.sensorReading}>
          <Feather name="wind" size={18} color="#64748b" />
          <Text style={styles.sensorText}>Ammonia</Text>
          <Text style={[styles.sensorValue, { color: '#059669' }]}>12 ppm</Text>
        </View>
        <View style={styles.sensorReading}>
          <Feather name="thermometer" size={18} color="#64748b" />
          <Text style={styles.sensorText}>Temperature</Text>
          <Text style={[styles.sensorValue, { color: '#2563eb' }]}>22°C</Text>
        </View>
        <View style={styles.sensorReading}>
          <Feather name="droplet" size={18} color="#64748b" />
          <Text style={styles.sensorText}>Humidity</Text>
          <Text style={[styles.sensorValue, { color: '#0891b2' }]}>45%</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionBtn, isScanning && styles.actionBtnDisabled]}
        onPress={() => handleScan('rescan')}
        disabled={isScanning}
      >
        {isScanning ? (
          <MaterialCommunityIcons name="loading" size={20} color="#fff" style={{ marginRight: 7 }} />
        ) : (
          <MaterialCommunityIcons name="reload" size={20} color="#fff" style={{ marginRight: 7 }} />
        )}
        <Text style={styles.actionBtnText}>{isScanning ? "Scanning..." : "🔄 Rescan"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryBtn}>
        <Octicons name="graph" size={18} color="#222" style={{ marginRight: 6 }} />
        <Text style={[styles.actionBtnText, { color: "#222" }]}>📊 View History</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const AlertScreen = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={alertVisible}
      onRequestClose={() => {
        setAlertVisible(false);
        setCurrentScreen('main');
      }}
    >
      <View style={styles.modalBg}>
        <View style={styles.modalContent}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.modalTitle}>🚨 FreshGuard Alert</Text>
            <TouchableOpacity onPress={() => { setAlertVisible(false); setCurrentScreen('main'); }}>
              <Ionicons name="close" size={26} color="#999" />
            </TouchableOpacity>
          </View>
          <View style={styles.alertBanner}>
            <Text style={{ fontSize: 32 }}>🔴</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold", color: "#b91c1c" }}>Spoiled Food Detected!</Text>
              <Text style={{ color: "#b91c1c", marginBottom: 2 }}>Reason: High Ammonia Level (85 ppm)</Text>
              <Text style={{ color: "#dc2626", fontWeight: "600" }}>⚠️ Advice: Please discard food immediately</Text>
            </View>
          </View>
          <View style={styles.sensorDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="alert" size={20} color="#dc2626" style={{ marginRight: 6 }} />
              <Text style={{ flex: 1 }}>Ammonia Level</Text>
              <Text style={{ color: "#dc2626", fontWeight: "bold" }}>85 ppm</Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="thermometer" size={18} color="#f59e42" style={{ marginRight: 6 }} />
              <Text style={{ flex: 1 }}>Temperature</Text>
              <Text style={{ color: "#f59e42", fontWeight: "bold" }}>28°C</Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="droplet" size={18} color="#0ea5e9" style={{ marginRight: 6 }} />
              <Text style={{ flex: 1 }}>Humidity</Text>
              <Text style={{ color: "#0ea5e9", fontWeight: "bold" }}>78%</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#999" style={{ marginRight: 6 }} />
              <Text style={{ flex: 1 }}>Time Since Cooked</Text>
              <Text style={{ color: "#666", fontWeight: "bold" }}>4 hours</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.actionBtn, { marginBottom: 12, marginTop: 12, backgroundColor: "#16a34a" }]} onPress={() => { setAlertVisible(false); setCurrentScreen('main'); }}>
            <FontAwesome name="check" size={16} color="#fff" style={{ marginRight: 7 }} />
            <Text style={styles.actionBtnText}>✓ Dismiss Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Octicons name="graph" size={18} color="#222" style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: "#222" }]}>👁 View Graph</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Ionicons name="information-circle" size={18} color="#222" style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: "#222" }]}>ℹ Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {currentScreen === 'main' && <MainScreen />}
      {alertVisible && <AlertScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 18, backgroundColor: "#f8fafc", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "bold", color: "#222" },
  subtitle: { fontSize: 13, color: "#6b7280" },
  cards: { width: "100%", marginVertical: 18 },
  detectCard: {
    backgroundColor: "#fff", borderRadius: 16, flexDirection: "row", alignItems: "center",
    marginBottom: 12, paddingVertical: 20, paddingHorizontal: 16, elevation: 2
  },
  iconCircle: { width: 44, height: 44, borderRadius: 24, justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  cardDesc: { fontSize: 13, color: "#6b7280" },
  statusPanel: {
    width: "100%", backgroundColor: "#fff", borderRadius: 18, padding: 18, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 12, elevation: 3
  },
  statusHeading: { fontWeight: "bold", color: "#222", marginBottom: 10, fontSize: 15 },
  freshRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0fdf4", borderRadius: 13, marginBottom: 8, padding: 8 },
  freshText: { fontWeight: "bold", color: "#15803d", fontSize: 15 },
  freshScore: { color: "#059669", fontSize: 13 },
  greenDot: { width: 12, height: 12, backgroundColor: "#16a34a", borderRadius: 6, marginLeft: "auto" },
  sensorReading: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 10, padding: 7, marginBottom: 5, marginTop: 3 },
  sensorText: { marginLeft: 8, flex: 1, color: "#334155" },
  sensorValue: { fontWeight: "bold" },
  actionBtn: {
    backgroundColor: "#2563eb", padding: 15, borderRadius: 14, alignItems: "center", flexDirection: "row",
    justifyContent: "center", marginBottom: 8
  },
  actionBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  actionBtnDisabled: { backgroundColor: "#93c5fd" },
  secondaryBtn: {
    backgroundColor: "#e5e7eb", padding: 13, borderRadius: 14, alignItems: "center", flexDirection: "row",
    justifyContent: "center", marginBottom: 8
  },
  modalBg: { flex: 1, backgroundColor: "#0008", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 18, padding: 20, width: "90%", maxWidth: 370 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#b91c1c", marginBottom: 18 },
  alertBanner: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fee2e2", borderRadius: 14, padding: 12, marginBottom: 14 },
  sensorDetails: { marginVertical: 8 },
  detailRow: { flexDirection: "row", alignItems: "center", paddingVertical: 7 },
});
