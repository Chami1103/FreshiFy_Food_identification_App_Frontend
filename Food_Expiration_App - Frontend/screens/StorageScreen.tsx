import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const foodItems = [
  { id: 1, name: 'Bananas', location: 'counter', icon: '🍌' },
  { id: 2, name: 'Dhal Curry', location: 'refrigerator', icon: '🍛' },
  { id: 3, name: 'Milk', location: 'refrigerator', icon: '🥛' },
  { id: 4, name: 'Lettuce', location: 'refrigerator', icon: '🥬' },
];

export default function StorageScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Storage Management</Text>
      {/* Refrigerator Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#bae6fd' }]}>
            <Feather name="thermometer" size={24} color="#2563eb" />
          </View>
          <Text style={styles.sectionTitle}>Refrigerator</Text>
        </View>
        <Text style={styles.sectionStatus}>Optimal • 4°C • 45% humidity</Text>
        <View style={styles.row}>
          {foodItems.filter(item => item.location === 'refrigerator').map(item => (
            <View key={item.id} style={styles.foodTag}>
              <Text style={styles.foodTagIcon}>{item.icon}</Text>
              <Text style={styles.foodTagText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* Counter Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#fef9c3' }]}>
            <Feather name="home" size={24} color="#eab308" />
          </View>
          <Text style={styles.sectionTitle}>Counter</Text>
        </View>
        <Text style={[styles.sectionStatus, { color: '#eab308' }]}>Monitor • 22°C • 55% humidity</Text>
        <View style={styles.row}>
          {foodItems.filter(item => item.location === 'counter').map(item => (
            <View key={item.id} style={[styles.foodTag, { backgroundColor: '#fef9c3' }]}>
              <Text style={styles.foodTagIcon}>{item.icon}</Text>
              <Text style={[styles.foodTagText, { color: '#eab308' }]}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* Recommendations */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsHeader}>Storage Recommendations</Text>
        <View style={[styles.tip, { backgroundColor: '#dcfce7' }]}>
          <Text style={styles.tipText}>✅ Dhal Curry + Milk: Safe to store together in refrigerator</Text>
        </View>
        <View style={[styles.tip, { backgroundColor: '#fef9c3' }]}>
          <Text style={[styles.tipText, { color: '#eab308' }]}>⚠️ Bananas + Lettuce: Store separately — bananas release ethylene gas</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  sectionStatus: { fontSize: 14, color: '#4b5563', marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foodTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e5e7eb', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  foodTagIcon: { marginRight: 6, fontSize: 16 },
  foodTagText: { fontSize: 14, fontWeight: '500' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tipsSection: { marginTop: 20 },
  tipsHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  tip: { padding: 12, borderRadius: 10, marginBottom: 8 },
  tipText: { fontSize: 14, fontWeight: '500' },
});
