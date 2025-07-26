// ✅ Integrated DetectionScreen.tsx
// Combination of camera/gallery scan logic + gas sensor + inventory + unified modal

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function DetectionScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [showAddFood, setShowAddFood] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [foodDays, setFoodDays] = useState('');
  const [foodLocation, setFoodLocation] = useState('');
  const [foodEmoji, setFoodEmoji] = useState('');
  const [foodScore, setFoodScore] = useState('');
  const [addingFood, setAddingFood] = useState(false);

  const sendToBackend = async (uri) => {
    try {
      const fileType = uri.substring(uri.lastIndexOf('.') + 1);
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: `upload.jpg`,
        type: `image/jpg`,
      });

      setIsScanning(true);
      setShowScanModal(true);

      const response = await fetch('http://192.168.8.102:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        console.log('❌ Backend error:', data.error);
        alert('Prediction failed');
        setIsScanning(false);
        return;
      }

      setScanResult({
        type: 'photo',
        fruit: data.fruit,
        status: data.status,
        confidence: 95,
        freshnessScore: 90,
        recommendation: 'Eat within 2 days for best taste.',
      });
    } catch (error) {
      console.log('❌ Fetch error:', error);
      alert('Prediction failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCameraScan = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Camera permission required');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.cancelled && result.assets?.length > 0) {
      sendToBackend(result.assets[0].uri);
    }
  };

  const handleUploadImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Gallery access required');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!result.cancelled && result.assets?.length > 0) {
      sendToBackend(result.assets[0].uri);
    }
  };

  const handleSensorScan = () => {
    setIsScanning(true);
    setShowScanModal(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        type: 'sensor',
        status: 'Fresh',
        ammonia: 1.8,
        temperature: 4.2,
        humidity: 44,
        recommendation: 'Safe to consume. Recheck in 24 hours.',
        freshnessScore: 91,
      });
    }, 2000);
  };

  const getFreshnessColor = (freshness) => {
    if (freshness === 'Fresh') return { bg: '#dcfce7', color: '#16a34a', border: '#22c55e' };
    if (freshness === 'Spoiled') return { bg: '#fee2e2', color: '#dc2626', border: '#dc2626' };
    return { bg: '#fef9c3', color: '#eab308', border: '#eab308' };
  };

  const handleAddFood = () => {
    setAddingFood(true);
    setTimeout(() => {
      setFoodItems([...foodItems, {
        id: Date.now(),
        name: foodName,
        location: foodLocation,
        daysLeft: parseInt(foodDays),
        freshness: 'Fresh',
        image: foodEmoji,
        freshnessScore: parseInt(foodScore)
      }]);
      setShowAddFood(false);
      setFoodName('');
      setFoodDays('');
      setFoodLocation('');
      setFoodEmoji('');
      setFoodScore('');
      setAddingFood(false);
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Detection Screen</Text>

      <View style={styles.detectCard}>
        <View style={[styles.detectIconBox, { backgroundColor: '#2563eb' }]}> <Feather name="camera" size={28} color="#fff" /> </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>📷 AI Vision Detection</Text>
          <Text style={styles.cardDesc}>Capture or upload food image to detect freshness</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 9 }}>
            <TouchableOpacity style={styles.scanBtnBlue} onPress={handleCameraScan}>
              <Feather name="camera" size={16} color="#fff" style={{ marginRight: 7 }} />
              <Text style={styles.scanBtnText}>Scan Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scanBtnBorder} onPress={handleUploadImage}>
              <Feather name="upload" size={16} color="#2563eb" style={{ marginRight: 7 }} />
              <Text style={[styles.scanBtnText, { color: '#2563eb' }]}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.detectCard}>
        <View style={[styles.detectIconBox, { backgroundColor: '#7c3aed' }]}> <Feather name="wind" size={28} color="#fff" /> </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>🔬 Gas Sensor Analysis</Text>
          <Text style={styles.cardDesc}>Real-time spoilage detection via chemical analysis</Text>
          <TouchableOpacity style={styles.scanBtnPurple} onPress={handleSensorScan}>
            <Feather name="wind" size={16} color="#fff" style={{ marginRight: 7 }} />
            <Text style={styles.scanBtnText}>Start Gas Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inventoryPanel}>
        <View style={styles.inventoryHeader}>
          <Text style={styles.inventoryTitle}>Current Inventory</Text>
          <TouchableOpacity style={styles.addFoodBtn} onPress={() => setShowAddFood(true)}>
            <Feather name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={foodItems}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const c = getFreshnessColor(item.freshness);
            return (
              <View style={styles.inventoryRow}>
                <View style={styles.foodImgBox}>
                  <Text style={styles.foodImg}>{item.image}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Feather name="package" size={12} color="#64748b" style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 13, color: '#64748b' }}>{item.location}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Score: {item.freshnessScore}/100</Text>
                </View>
                <View style={[styles.statusTag, { backgroundColor: c.bg, borderColor: c.border }]}>
                  <Text style={{ color: c.color, fontWeight: 'bold', fontSize: 12 }}>{item.freshness}</Text>
                </View>
                <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>{item.daysLeft}d</Text>
              </View>
            );
          }}
        />
      </View>

      <Modal visible={showAddFood} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
          <View style={[styles.modalCard, { alignItems: 'center', padding: 32, width: '90%' }]}>
            <Text style={styles.modalTitle}>Add Food Item</Text>
            <TextInput placeholder="Food name (e.g. Apple)" style={styles.input} value={foodName} onChangeText={setFoodName} />
            <TextInput placeholder="Days left" style={styles.input} value={foodDays} onChangeText={setFoodDays} keyboardType="numeric" />
            <TextInput placeholder="Location (Counter / Refrigerator)" style={styles.input} value={foodLocation} onChangeText={setFoodLocation} />
            <TextInput placeholder="Emoji (e.g. 🍎)" style={styles.input} value={foodEmoji} onChangeText={setFoodEmoji} maxLength={2} />
            <TextInput placeholder="Freshness Score (1-100)" style={styles.input} value={foodScore} onChangeText={setFoodScore} keyboardType="numeric" />
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: '#22c55e', width: '80%', marginTop: 15 }]} onPress={handleAddFood} disabled={addingFood || !foodName || !foodDays || !foodEmoji || !foodScore}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{addingFood ? 'Adding...' : 'Add Food'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: '#2563eb', width: '80%', marginTop: 8 }]} onPress={() => setShowAddFood(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', marginBottom: 18 },
  detectCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 18, elevation: 2 },
  detectIconBox: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  cardDesc: { fontSize: 13, color: '#64748b', marginBottom: 2, marginTop: 2 },
  scanBtnBlue: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginTop: 2 },
  scanBtnPurple: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7c3aed', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginTop: 9, width: '85%' },
  scanBtnBorder: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#2563eb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginTop: 2 },
  scanBtnText: { fontWeight: 'bold', fontSize: 13 },
  inventoryPanel: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginTop: 18, marginBottom: 24, elevation: 1 },
  inventoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  inventoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
  addFoodBtn: { backgroundColor: '#22c55e', borderRadius: 10, padding: 8 },
  inventoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 13, backgroundColor: '#f8fafc', padding: 10, borderRadius: 13, elevation: 1 },
  foodImgBox: { width: 38, height: 38, backgroundColor: '#e5e7eb', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  foodImg: { fontSize: 23 },
  foodName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  statusTag: { borderRadius: 11, borderWidth: 1.5, paddingVertical: 2, paddingHorizontal: 13, marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', padding: 32, borderRadius: 18, width: '88%', maxWidth: 370, alignSelf: 'center', elevation: 5 },
  scanningCircle: { width: 70, height: 70, backgroundColor: '#2563eb10', borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  scanResultIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  modalTitle: { marginTop: 4, fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'center' },
  modalDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 12 },
  sensorResults: { marginTop: 7, marginBottom: 5, alignItems: 'center' },
  sensorStatus: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  sensorDetail: { fontSize: 14, color: '#2563eb', marginBottom: 1 },
  sensorRecommendation: { marginTop: 8, fontSize: 13, color: '#16a34a', textAlign: 'center', fontWeight: 'bold' },
  closeBtn: { marginTop: 17, backgroundColor: '#2563eb', paddingVertical: 11, paddingHorizontal: 44, borderRadius: 8, alignItems: 'center' },
  input: { width: '90%', padding: 12, marginTop: 10, borderRadius: 9, borderWidth: 1, borderColor: '#e5e7eb', fontSize: 16, backgroundColor: '#f1f5f9' },
});
