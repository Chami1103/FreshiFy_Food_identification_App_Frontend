import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../MainApp';

export default function UserProfile({ navigation }) {
  const { user, login, signup, logout } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (user) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>👤 {user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <TouchableOpacity onPress={logout} style={styles.btn}><Text>Logout</Text></TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TouchableOpacity onPress={() => signup(name, email)} style={styles.btn}><Text>Sign Up</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => login('Demo User', 'demo@mail.com')} style={styles.btn}><Text>Demo Login</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 14 },
  btn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, marginTop: 12 }
});
