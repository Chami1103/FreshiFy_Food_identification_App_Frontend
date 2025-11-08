// screens/ProfileScreen.tsx
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
      {/* 👤 Header Section */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/profile-avatar.png")}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: isDark ? "#f8fafc" : "#111827" }]}>
          FreshiFy User
        </Text>
        <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
          Sustainable Living Advocate 🌿
        </Text>
      </View>

      {/* ⚙️ Account Section */}
      <Section title="Account" isDark={isDark}>
        <ProfileItem
          icon="person-circle-outline"
          label="Edit Profile"
          isDark={isDark}
        />
        <ProfileItem
          icon="key-outline"
          label="Change Password"
          isDark={isDark}
        />
      </Section>

      {/* 🌙 Preferences Section */}
      <Section title="Preferences" isDark={isDark}>
        <ProfileItem
          icon={isDark ? "moon-outline" : "sunny-outline"}
          label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          isDark={isDark}
          onPress={toggleTheme}
        />
        <ProfileItem
          icon="notifications-outline"
          label="Notification Settings"
          isDark={isDark}
        />
      </Section>

      {/* ℹ️ About Section */}
      <Section title="About" isDark={isDark}>
        <ProfileItem
          icon="information-circle-outline"
          label="App Version 1.0.0"
          isDark={isDark}
        />
        <ProfileItem
          icon="help-circle-outline"
          label="Help & Support"
          isDark={isDark}
        />
      </Section>
    </ScrollView>
  );
};

/* 🔹 Reusable Section Wrapper */
const Section: React.FC<{ title: string; isDark: boolean; children: React.ReactNode }> = ({
  title,
  isDark,
  children,
}) => (
  <View style={styles.section}>
    <Text
      style={[
        styles.sectionTitle,
        { color: isDark ? "#f1f5f9" : "#1e293b" },
      ]}
    >
      {title}
    </Text>
    <View style={[styles.card, isDark && styles.cardDark]}>{children}</View>
  </View>
);

/* 🔹 Reusable Item Component */
const ProfileItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isDark: boolean;
  onPress?: () => void;
}> = ({ icon, label, isDark, onPress }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <Ionicons
      name={icon}
      size={22}
      color={isDark ? "#38bdf8" : "#2563eb"}
    />
    <Text
      style={[
        styles.itemText,
        { color: isDark ? "#f8fafc" : "#1e293b" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default ProfileScreen;

/* ---------------- 🎨 STYLES ---------------- */

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
  cardDark: {
    backgroundColor: "#1e293b",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
  },
  itemText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },
});
