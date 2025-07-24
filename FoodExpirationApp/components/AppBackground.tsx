// AppBackground.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // expo install expo-linear-gradient
import { useTheme } from './AppThemeProvider';

export default function AppBackground({ children, animated = false }) {
  const { theme, dark } = useTheme();

  // Simple static background
  if (!animated) {
    return (
      <View style={[styles.bg, { backgroundColor: theme.bg }]}>
        {children}
      </View>
    );
  }

  // Example: gradient background (edit colors as you like)
  return (
    <LinearGradient
      colors={dark ? ['#1e293b', '#23232a', '#18181b'] : ['#e0e7ff', '#f1f5f9']}
      style={styles.bg}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
});
