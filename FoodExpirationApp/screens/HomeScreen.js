import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission denied', 'You need permission to access photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      uploadToServer(result.uri);
    }
  };

  const uploadToServer = async (uri) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    try {
      const res = await axios.post('http://192.168.1.6:5000/predict-image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      Alert.alert('Upload Failed', 'Could not connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>🍎 Freshify AI</Text>
      <Text style={styles.subtitle}>Upload a food image to check its freshness</Text>

      <Button mode="contained" onPress={pickImage} style={styles.uploadBtn}>
        Pick Image
      </Button>

      {image && (
        <Card style={styles.imageCard}>
          <Card.Cover source={{ uri: image }} />
        </Card>
      )}

      {loading && <ActivityIndicator animating={true} size="large" style={styles.loader} />}

      {result && !loading && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.resultText}>
              🧠 Prediction Result
            </Text>
            <Text style={styles.status}>Status: <Text style={{ color: 'blue' }}>{result.status}</Text></Text>
            <Text style={styles.fruit}>Fruit: <Text style={{ color: 'green' }}>{result.fruit}</Text></Text>
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#f8f9fa' },
  title: { marginTop: 40 },
  subtitle: { marginBottom: 20, fontSize: 14, color: '#555' },
  uploadBtn: { marginVertical: 10, width: '60%' },
  imageCard: { width: '100%', marginVertical: 20 },
  resultCard: { marginTop: 20, width: '100%', backgroundColor: '#fff' },
  resultText: { marginBottom: 10, fontWeight: 'bold' },
  status: { fontSize: 16, marginBottom: 5 },
  fruit: { fontSize: 16 },
  loader: { marginTop: 30 },
});
