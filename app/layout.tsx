import React from "react";
import { View, StatusBar, Platform } from "react-native";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import BottomNavigationBar from "../components/BottomNavigationBar";
import Toast from "react-native-toast-message";

/**
 * AppLayout — handles top-level theming, transparent status bar, and
 * full-bleed layout so content can scroll under header & notch areas.
 */
function AppLayout() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === "light" ? "#f8fafc" : "#0f172a",
      }}
    >
      {/* ✅ Transparent status bar (content scrolls under notch) */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      {/* ✅ Full-screen navigation and header stack */}
      <BottomNavigationBar />

      {/* ✅ Global toast notifications */}
      <Toast position="top" topOffset={Platform.OS === "android" ? 50 : 70} />
    </View>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppLayout />
      </NotificationProvider>
    </ThemeProvider>
  );
}
