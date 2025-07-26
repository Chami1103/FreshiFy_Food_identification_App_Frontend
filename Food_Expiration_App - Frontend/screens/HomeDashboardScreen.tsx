import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal, Switch, Image } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

const foodItems = [
  { id: 1, name: 'Bananas', freshness: 'fresh', daysLeft: 3, icon: '🍌' },
  { id: 2, name: 'Dhal Curry', freshness: 'fresh', daysLeft: 2, icon: '🍛' },
  { id: 3, name: 'Milk', freshness: 'fresh', daysLeft: 5, icon: '🥛' },
  { id: 4, name: 'Lettuce', freshness: 'near spoilage', daysLeft: 1, icon: '🥬' },
];
const alerts = [
  { id: 1, message: 'High ammonia detected – Food spoilage alert!', time: '2m ago', type: 'critical' },
  { id: 2, message: 'Lettuce expires in 1 day', time: '2h ago', type: 'warning' },
  { id: 3, message: 'Recipe suggestion: Use expiring lettuce', time: '5h ago', type: 'info' },
];
const envData = { temperature: 4.2, humidity: 45, status: 'optimal', ammonia: 18.6, ethylene: 0.6 };

export default function HomeDashboardScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const theme = isDark ? darkTheme : lightTheme;
  const freshCount = foodItems.filter(i => i.freshness === 'fresh').length;
  const expiringSoon = foodItems.filter(i => i.daysLeft <= 2).length;
  const nearSpoilage = foodItems.filter(i => i.freshness === 'near spoilage').length;
  let envColor = '#16a34a', envText = 'Optimal';
  if (envData.ammonia > 50 || envData.ethylene > 1.0) { envColor = '#dc2626'; envText = 'Critical'; }
  else if (envData.ammonia > 25 || envData.ethylene > 0.5) { envColor = '#f59e42'; envText = 'Warning'; }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header with Profile/Settings */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="lightning-bolt" size={34} color="#fff" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Freshify</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Smart Food Monitoring System</Text>
        <View style={styles.liveRow}>
          <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.liveText}>Live Monitoring</Text>
        </View>
        {/* Profile & Settings Row */}
        <View style={{ position: 'absolute', right: 24, top: 8, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 12 }} onPress={() => setSettingsVisible(true)}>
            <Feather name="settings" size={26} color={theme.icon} />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#fff' }}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#dcfce7" }]}>
          <Feather name="check-circle" size={28} color="#16a34a" />
          <Text style={styles.statNum}>{freshCount}</Text>
          <Text style={styles.statLabel}>Fresh Items</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#fef3c7" }]}>
          <Feather name="clock" size={28} color="#eab308" />
          <Text style={[styles.statNum, { color: "#eab308" }]}>{expiringSoon}</Text>
          <Text style={styles.statLabel}>Expiring Soon</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#fee2e2" }]}>
          <Feather name="alert-triangle" size={28} color="#dc2626" />
          <Text style={[styles.statNum, { color: "#dc2626" }]}>{nearSpoilage}</Text>
          <Text style={styles.statLabel}>Near Spoilage</Text>
        </View>
      </View>

      {/* Environmental Monitor */}
      <View style={[styles.panel, { backgroundColor: theme.card }]}>
        <View style={styles.panelRow}>
          <Ionicons name="leaf" size={24} color={envColor} style={{ marginRight: 6 }} />
          <Text style={[styles.panelTitle, { color: envColor }]}>Environment Status: {envText}</Text>
        </View>
        <View style={styles.envStats}>
          <View style={styles.envItem}>
            <Feather name="thermometer" size={18} color="#2563eb" />
            <Text style={[styles.envValue, { color: theme.text }]}>{envData.temperature}°C</Text>
            <Text style={styles.envLabel}>Temp</Text>
          </View>
          <View style={styles.envItem}>
            <Feather name="droplets" size={18} color="#06b6d4" />
            <Text style={[styles.envValue, { color: theme.text }]}>{envData.humidity}%</Text>
            <Text style={styles.envLabel}>Humidity</Text>
          </View>
          <View style={styles.envItem}>
            <Feather name="wind" size={18} color="#dc2626" />
            <Text style={[styles.envValue, { color: theme.text }]}>{envData.ammonia} ppm</Text>
            <Text style={styles.envLabel}>Ammonia</Text>
          </View>
          <View style={styles.envItem}>
            <Feather name="activity" size={18} color="#a21caf" />
            <Text style={[styles.envValue, { color: theme.text }]}>{envData.ethylene} ppm</Text>
            <Text style={styles.envLabel}>Ethylene</Text>
          </View>
        </View>
      </View>

      {/* Recent Alerts */}
      <View style={[styles.panel, { backgroundColor: theme.card }]}>
        <View style={styles.panelRow}>
          <MaterialCommunityIcons name="bell-alert" size={22} color="#eab308" style={{ marginRight: 5 }} />
          <Text style={[styles.panelTitle, { color: theme.text }]}>Recent Alerts</Text>
        </View>
        {alerts.map(alert => (
          <View key={alert.id} style={[styles.alertRow, alert.type === 'critical' && { borderLeftColor: '#dc2626' }, alert.type === 'warning' && { borderLeftColor: '#eab308' }, alert.type === 'info' && { borderLeftColor: '#2563eb' }, { backgroundColor: theme.bgSoft }]}>
            <Feather name={alert.type === 'critical' ? "alert-triangle" : alert.type === 'warning' ? "clock" : "info"} size={17} color={
              alert.type === 'critical' ? "#dc2626" : alert.type === 'warning' ? "#eab308" : "#2563eb"
            } style={{ marginRight: 7 }} />
            <View>
              <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 15 }}>{alert.message}</Text>
              <Text style={{ color: theme.subtext, fontSize: 12 }}>{alert.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Food Quick List */}
      <View style={[styles.panel, { backgroundColor: theme.card }]}>
        <View style={styles.panelRow}>
          <MaterialCommunityIcons name="fridge-outline" size={22} color="#06b6d4" style={{ marginRight: 5 }} />
          <Text style={[styles.panelTitle, { color: theme.text }]}>Current Inventory</Text>
        </View>
        <FlatList
          horizontal
          data={foodItems}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.foodCard, { backgroundColor: theme.bgSoft }]}>
              <Text style={styles.foodIcon}>{item.icon}</Text>
              <Text style={[styles.foodName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.foodStatus, item.freshness === 'fresh'
                ? { color: '#16a34a' }
                : item.freshness === 'near spoilage'
                  ? { color: '#eab308' }
                  : { color: '#dc2626' }
              ]}>{item.freshness.toUpperCase()}</Text>
              <Text style={[styles.foodDays, { color: theme.subtext }]}>{item.daysLeft}d left</Text>
            </View>
          )}
        />
      </View>

      {/* Settings/Profile Modal */}
      <Modal visible={settingsVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.settingsModal, { backgroundColor: theme.card }]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: theme.text }}>Profile & Settings</Text>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={{ width: 68, height: 68, borderRadius: 34, marginBottom: 10 }}
            />
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Chamika Vimukthi</Text>
            <Text style={{ color: theme.subtext, marginBottom: 18 }}>chamika@email.com</Text>
            <View style={styles.switchRow}>
              <Feather name="moon" size={20} color={theme.icon} />
              <Text style={{ color: theme.text, fontSize: 15, marginLeft: 10 }}>Dark Mode</Text>
              <Switch value={isDark} onValueChange={setIsDark} style={{ marginLeft: 'auto' }} />
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: '#2563eb' }]}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const lightTheme = {
  bg: '#f8fafc',
  card: '#fff',
  bgSoft: '#f1f5f9',
  text: '#222',
  subtext: '#64748b',
  icon: '#222'
};
const darkTheme = {
  bg: '#18181b',
  card: '#23232a',
  bgSoft: '#31313a',
  text: '#f3f4f6',
  subtext: '#cbd5e1',
  icon: '#38bdf8'
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', marginTop: 36, marginBottom: 18 },
  iconCircle: { width: 58, height: 58, backgroundColor: '#22c55e', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 30, fontWeight: 'bold' },
  subtitle: { fontSize: 15, marginBottom: 6 },
  liveRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  liveText: { color: '#16a34a', fontSize: 13, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 20 },
  statCard: { flex: 1, alignItems: 'center', borderRadius: 16, padding: 20, marginHorizontal: 8, elevation: 2 },
  statNum: { fontSize: 28, fontWeight: 'bold', marginTop: 6 },
  statLabel: { fontSize: 13, color: "#374151", marginTop: 3, fontWeight: '600' },
  panel: { borderRadius: 18, padding: 17, marginBottom: 18, marginHorizontal: 2, elevation: 1 },
  panelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  panelTitle: { fontSize: 17, fontWeight: 'bold' },
  envStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9, marginBottom: 3 },
  envItem: { alignItems: 'center', flex: 1 },
  envValue: { fontWeight: 'bold', fontSize: 15, marginVertical: 2 },
  envLabel: { fontSize: 12, color: '#64748b' },
  alertRow: { flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, paddingLeft: 12, paddingVertical: 7, marginBottom: 5, borderRadius: 7 },
  foodCard: { alignItems: 'center', borderRadius: 13, marginRight: 12, padding: 12, minWidth: 88, elevation: 2 },
  foodIcon: { fontSize: 30, marginBottom: 4 },
  foodName: { fontWeight: 'bold', fontSize: 14 },
  foodStatus: { fontSize: 12, fontWeight: 'bold', marginTop: 1 },
  foodDays: { fontSize: 11, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: '#0009', justifyContent: 'center', alignItems: 'center' },
  settingsModal: { borderRadius: 18, alignItems: 'center', padding: 24, width: 310, elevation: 7 },
  closeBtn: { marginTop: 24, paddingVertical: 11, paddingHorizontal: 46, borderRadius: 8, alignItems: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 8, width: 200, alignSelf: 'center' },
});
