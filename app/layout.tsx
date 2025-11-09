import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import BottomNavigationBar from "../components/BottomNavigationBar";
import Toast from "react-native-toast-message";

function AppLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme === "light" ? "#f8fafc" : "#0f172a",
      }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <BottomNavigationBar />
      <Toast />
    </SafeAreaView>
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
