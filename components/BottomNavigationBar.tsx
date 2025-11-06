import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

// Screens
import HomeScreen from "../screens/HomeScreen";
import DetectionScreen from "../screens/DetectionScreen";
import RecipesScreen from "../screens/RecipesScreen";
import BlogScreen from "../screens/BlogScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Contexts
import { ThemeProvider } from "../contexts/ThemeContext";
import { NotificationProvider } from "../contexts/NotificationContext";

// Header
import Header from "../components/Header";

const Tab = createBottomTabNavigator();

const BottomNavigationBar = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <View style={styles.container}>
          {/* Global Header (always visible) */}
          <Header isHeaderVisible={true} />

          {/* Navigation Container */}
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#2563eb",
                tabBarInactiveTintColor: "#94a3b8",
                tabBarStyle: {
                  backgroundColor: "#f8fafc",
                  borderTopWidth: 0.3,
                  height: 60,
                  paddingBottom: 6,
                },
                tabBarIcon: ({ color, size }) => {
                  let icon: keyof typeof Ionicons.glyphMap;

                  switch (route.name) {
                    case "Home":
                      icon = "home-outline";
                      break;
                    case "Detect":
                      icon = "scan-outline";
                      break;
                    case "Recipes":
                      icon = "restaurant-outline";
                      break;
                    case "Blog":
                      icon = "book-outline";
                      break;
                    case "Profile":
                      icon = "person-outline";
                      break;
                    default:
                      icon = "ellipse-outline";
                  }

                  return <Ionicons name={icon} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Detect" component={DetectionScreen} />
              <Tab.Screen name="Recipes" component={RecipesScreen} />
              <Tab.Screen name="Blog" component={BlogScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </NavigationContainer>

          {/* Toast Notifications (global) */}
          <Toast />
        </View>
      </NotificationProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
});

export default BottomNavigationBar;
