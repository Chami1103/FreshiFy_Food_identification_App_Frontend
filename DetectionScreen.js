import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DetectionScreen = () => {
  const [tab, setTab] = useState('image');
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [sensor, setSensor] = useState(null);
  const [gasHistory, setGasHistory] = useState([]);
  const [colorHistory, setColorHistory] = useState({ r: [], g: [], b: [] });
  const intervalRef = useRef(null);
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();

    intervalRef.current = setInterval(fetchSensor, 5000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const fetchSensor = async () => {
    try {
      const res = await fetch('http://192.168.8.1:5000/api/sensor');
      const data = await res.json();
      setSensor(data);
      setGasHistory(prev => [...prev.slice(-19), data.nh3]);
      setColorHistory(prev => ({
        r: [...prev.r.slice(-19), data.r],
        g: [...prev.g.slice(-19), data.g],
        b: [...prev.b.slice(-19), data.b],
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const pickImage = () => {
    Alert.alert('Select Image', 'Choose source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const res = await launchCamera({ mediaType: 'photo', quality: 0.7 });
    handleImage(res);
  };

  const openGallery = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    handleImage(res);
  };

  const handleImage = async response => {
    if (response.didCancel || !response.assets || !response.assets.length) {
      return;
    }
    const asset = response.assets[0];
    setImageUri(asset.uri);
    setResult(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName || 'photo.jpg',
      });
      const res = await fetch('http://192.168.8.1:5000/predict', {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const json = await res.json();
      setResult(json);
    } catch (e) {
      Alert.alert('Error', 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderImageTab = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      {loading && (
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          <Icon name="sync" size={36} color="#fff" />
        </Animated.View>
      )}

      {result && (
        <LinearGradient colors={['#00c853', '#b2ff59']} style={styles.resultCard}>
          <Text style={styles.resultTitle}>{result.fruit}</Text>
          <Text
            style={[styles.resultStatus, result.status === 'fresh' ? styles.fresh : styles.spoiled]}
          >
            {result.status}
          </Text>
          {result.confidence && (
            <Text style={styles.confidence}>{`Confidence: ${(result.confidence * 100).toFixed(
              1,
            )}%`}</Text>
          )}
        </LinearGradient>
      )}
    </ScrollView>
  );

  const renderBar = (label, value, color) => (
    <View style={styles.barRow} key={label}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${(value / 255) * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barValue}>{value}</Text>
    </View>
  );

  const renderSensorTab = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Current Reading</Text>
        {sensor ? (
          <>
            {renderBar('R', sensor.r, '#ff1744')}
            {renderBar('G', sensor.g, '#00e676')}
            {renderBar('B', sensor.b, '#2979ff')}
            {renderBar('NH3', sensor.nh3, '#ff9100')}
          </>
        ) : (
          <Text style={styles.noData}>No data</Text>
        )}
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchSensor}>
          <Icon name="refresh" size={20} color="#fff" />
          <Text style={styles.refreshText}>Manual Check</Text>
        </TouchableOpacity>
      </View>

      {gasHistory.length > 1 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>NH3 Gas Trend</Text>
          <LineChart
            data={{
              labels: [],
              datasets: [{ data: gasHistory }],
            }}
            width={SCREEN_WIDTH - 40}
            height={160}
            yAxisSuffix=" ppm"
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {colorHistory.r.length > 1 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Color History</Text>
          <BarChart
            data={{
              labels: ['R', 'G', 'B'],
              datasets: [
                {
                  data: [
                    colorHistory.r.slice(-1)[0] || 0,
                    colorHistory.g.slice(-1)[0] || 0,
                    colorHistory.b.slice(-1)[0] || 0,
                  ],
                },
              ],
            }}
            fromZero
            width={SCREEN_WIDTH - 40}
            height={160}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      )}
    </ScrollView>
  );

  return (
    <LinearGradient colors={['#f5f5f5', '#e0e0e0']} style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'image' && styles.activeTab]}
          onPress={() => setTab('image')}
        >
          <Text style={[styles.tabText, tab === 'image' && styles.activeTabText]}>Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'sensor' && styles.activeTab]}
          onPress={() => setTab('sensor')}
        >
          <Text style={[styles.tabText, tab === 'sensor' && styles.activeTabText]}>Sensor</Text>
        </TouchableOpacity>
      </View>

      {tab === 'image' ? renderImageTab() : renderSensorTab()}
    </LinearGradient>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  propsForDots: {
    r: '3',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flexDirection: 'row', paddingTop: Platform.OS === 'ios' ? 50 : 20 },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#6200ee' },
  tabText: { fontSize: 16, color: '#777' },
  activeTabText: { color: '#6200ee', fontWeight: 'bold' },
  content: { padding: 20 },
  imagePicker: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { color: '#888' },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -18,
  },
  resultCard: { marginTop: 20, padding: 20, borderRadius: 10, alignItems: 'center' },
  resultTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  resultStatus: { fontSize: 18, marginTop: 10 },
  fresh: { color: '#00e676' },
  spoiled: { color: '#ff3d00' },
  confidence: { marginTop: 8, color: '#fff' },
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  noData: { color: '#999' },
  refreshBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#6200ee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  refreshText: { color: '#fff', marginLeft: 6 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  barLabel: { width: 30, fontWeight: 'bold' },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 8,
  },
  barFill: { height: 10, borderRadius: 5 },
  barValue: { width: 40, textAlign: 'right' },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  chart: { marginVertical: 8 },
});

export default DetectionScreen;
