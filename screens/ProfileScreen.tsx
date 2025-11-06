import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const ProfileScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? "#0f172a" : "#f8fafc" },
      ]}
    >
      <View style={styles.header}>
        <Image
          source={require("../assets/images/profile-avatar.png")}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: isDark ? "#f8fafc" : "#111827" }]}>
          Freshify User
        </Text>
        <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
          Sustainable Living Advocate 🌿
        </Text>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#f1f5f9" : "#1e293b" },
          ]}
        >
          Account
        </Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item}>
            <Ionicons
              name="person-circle-outline"
              size={22}
              color={isDark ? "#38bdf8" : "#2563eb"}
            />
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#f8fafc" : "#1e293b" },
              ]}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Ionicons
              name="key-outline"
              size={22}
              color={isDark ? "#38bdf8" : "#2563eb"}
            />
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#f8fafc" : "#1e293b" },
              ]}
            >
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#f1f5f9" : "#1e293b" },
          ]}
        >
          Preferences
        </Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.item}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? "moon-outline" : "sunny-outline"}
              size={22}
              color={isDark ? "#38bdf8" : "#2563eb"}
            />
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#f8fafc" : "#1e293b" },
              ]}
            >
              Switch to {isDark ? "Light" : "Dark"} Mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={isDark ? "#38bdf8" : "#2563eb"}
            />
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#f8fafc" : "#1e293b" },
              ]}
            >
              Notification Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#f1f5f9" : "#1e293b" },
          ]}
        >
          About
        </Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={isDark ? "#38bdf8" : "#2563eb"}
            />
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#f8fafc" : "#1e293b" },
              ]}
            >
              App Version 1.0.0
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Ionicons
              name="help-circle-outline"
              size={22}
              color={isDark ? "#38bdf8" : "#2563eb"}
            />
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#f8fafc" : "#1e293b" },
              ]}
            >
              Help & Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: "#e2e8f0",
  },
  itemText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },
});
