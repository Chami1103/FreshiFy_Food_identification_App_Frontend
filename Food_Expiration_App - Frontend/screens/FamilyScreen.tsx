import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const familyMembers = [
  { id: 1, name: 'John', age: 35, allergies: ['nuts'], preferences: ['vegetarian'], health: 'healthy' },
  { id: 2, name: 'Sarah', age: 32, allergies: [], preferences: ['low-carb'], health: 'diabetic' },
  { id: 3, name: 'Emma', age: 8, allergies: ['dairy'], preferences: ['mild-spicy'], health: 'healthy' },
];

export default function FamilyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Family Profiles</Text>

      {/* Family Members */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="users" size={20} color="#7c3aed" style={{ marginRight: 7 }} />
          <Text style={styles.sectionTitle}>Family Members</Text>
        </View>
        {familyMembers.map(member => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <View style={styles.memberIconCircle}>
                <Feather name="user" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberAge}>Age: {member.age}</Text>
              </View>
              <View style={[
                styles.healthTag,
                member.health === 'healthy'
                  ? { backgroundColor: '#dcfce7', color: '#16a34a' }
                  : { backgroundColor: '#fef9c3', color: '#eab308' }
              ]}>
                <Text style={{
                  color: member.health === 'healthy' ? '#16a34a' : '#eab308',
                  fontWeight: 'bold'
                }}>
                  {member.health}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Allergies:</Text>
              {member.allergies.length > 0 ? (
                member.allergies.map((al, i) => (
                  <Text key={i} style={styles.allergyTag}>{al}</Text>
                ))
              ) : (
                <Text style={styles.noneTag}>None</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Preferences:</Text>
              {member.preferences.map((pref, i) => (
                <Text key={i} style={styles.prefTag}>{pref}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#16a34a' }]}>Personalized Recommendations</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipHeader}>🧒 For Emma (8 years)</Text>
          <Text style={styles.tipText}>Avoid dairy in recipes due to allergy. Try banana smoothie with oat milk.</Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipHeader}>🍃 For Sarah (Low-carb)</Text>
          <Text style={styles.tipText}>Focus on lettuce salad recipes. Avoid banana-based dishes.</Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipHeader}>🥗 For John (Vegetarian)</Text>
          <Text style={styles.tipText}>All current recipes are suitable. Watch for nut allergens.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 18, marginTop: 14 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 22, elevation: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: 17, color: '#7c3aed', marginBottom: 4 },
  memberCard: { backgroundColor: '#f1f5f9', borderRadius: 14, padding: 13, marginBottom: 13 },
  memberHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  memberIconCircle: { width: 34, height: 34, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a5b4fc', marginRight: 12 },
  memberName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  memberAge: { fontSize: 13, color: '#64748b' },
  healthTag: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, backgroundColor: '#dcfce7' },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 3, marginBottom: 2 },
  infoLabel: { fontWeight: 'bold', color: '#64748b', marginRight: 8, fontSize: 13 },
  allergyTag: { backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, marginRight: 7, fontSize: 13, marginTop: 3 },
  prefTag: { backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, marginRight: 7, fontSize: 13, marginTop: 3 },
  noneTag: { color: '#9ca3af', fontSize: 13 },
  tipCard: { backgroundColor: '#dcfce7', borderRadius: 10, padding: 12, marginBottom: 9 },
  tipHeader: { fontWeight: 'bold', color: '#16a34a', marginBottom: 3 },
  tipText: { color: '#14532d', fontSize: 14 },
});

export default FamilyScreen;
