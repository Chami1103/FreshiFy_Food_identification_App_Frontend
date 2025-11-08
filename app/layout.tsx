// app/layout.tsx
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "../contexts/ThemeContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import BottomNavigationBar from "../components/BottomNavigationBar";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
          <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
          <BottomNavigationBar />
          <Toast />
        </SafeAreaView>
      </NotificationProvider>
    </ThemeProvider>
  );
}
