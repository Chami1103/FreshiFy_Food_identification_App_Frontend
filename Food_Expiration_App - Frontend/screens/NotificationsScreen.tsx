import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const notifications = [
  { id: 1, message: 'High ammonia detected - Food spoilage alert!', time: '2 minutes ago', priority: 'high' },
  { id: 2, message: 'Lettuce expires in 1 day', time: '2 hours ago', priority: 'high' },
  { id: 3, message: 'Recipe suggestion: Use expiring lettuce', time: '5 hours ago', priority: 'low' },
];

export default function NotificationsScreen() {
  const count = (priority: string) =>
    notifications.filter(n => n.priority === priority).length;

  const getColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e42';
      case 'low': return '#2563eb';
      default: return '#64748b';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#fee2e2' }]}>
          <MaterialCommunityIcons name="alert" size={28} color="#ef4444" />
          <Text style={[styles.statNum, { color: '#ef4444' }]}>{count('high')}</Text>
          <Text style={styles.statLabel}>Critical</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fef9c3' }]}>
          <Feather name="clock" size={28} color="#f59e42" />
          <Text style={[styles.statNum, { color: '#f59e42' }]}>{count('medium')}</Text>
          <Text style={styles.statLabel}>Warning</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
          <Feather name="check-circle" size={28} color="#2563eb" />
          <Text style={[styles.statNum, { color: '#2563eb' }]}>{count('low')}</Text>
          <Text style={styles.statLabel}>Info</Text>
        </View>
      </View>

      {/* Notification List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Notifications</Text>
        {notifications.map(n => (
          <View key={n.id} style={[styles.notificationCard, { borderLeftColor: getColor(n.priority) }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              {n.priority === 'high' && <MaterialCommunityIcons name="alert" size={18} color="#ef4444" style={{ marginRight: 6 }} />}
              {n.priority === 'medium' && <Feather name="clock" size={16} color="#f59e42" style={{ marginRight: 6 }} />}
              {n.priority === 'low' && <Feather name="check-circle" size={16} color="#2563eb" style={{ marginRight: 6 }} />}
              <Text style={[styles.prioTag, { color: getColor(n.priority) }]}>{n.priority.toUpperCase()}</Text>
            </View>
            <Text style={styles.message}>{n.message}</Text>
            <Text style={styles.time}>{n.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 18, marginTop: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 18 },
  statCard: { flex: 1, alignItems: 'center', borderRadius: 14, padding: 18, marginHorizontal: 7 },
  statNum: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  statLabel: { fontSize: 13, color: "#374151", marginTop: 2 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 22, elevation: 1 },
  sectionTitle: { fontWeight: 'bold', fontSize: 17, marginBottom: 12, color: '#2563eb' },
  notificationCard: { backgroundColor: '#f1f5f9', borderRadius: 10, borderLeftWidth: 5, padding: 14, marginBottom: 10 },
  prioTag: { fontSize: 12, fontWeight: 'bold', marginRight: 4 },
  message: { fontSize: 15, color: '#222', fontWeight: 'bold', marginBottom: 3 },
  time: { fontSize: 13, color: '#64748b' },
});

export default NotificationsScreen;
