//E:\FreshiFy_Mobile_App_Frontend\components\Header.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  Easing,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import { getNotifications } from "../services/apiService";
import { NOTIFICATION_TYPES } from "../utils/constants";
import { formatTime } from "../utils/formatters";

interface HeaderProps {
  isHeaderVisible: boolean;
}

interface Notification {
  id: string;
  title: string;
  type?: string;
  timestamp: string;
  read?: boolean;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const Header: React.FC<HeaderProps> = ({ isHeaderVisible }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 🎞️ Animations (no blurIntensity!)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const parallaxShift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      } catch (err) {
        console.warn("Header Notification Error:", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isHeaderVisible ? 1 : 0,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: isHeaderVisible ? 0 : -80,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(parallaxShift, {
        toValue: isHeaderVisible ? 0 : -10,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isHeaderVisible]);

  const latest = notifications[0];
  const latestText =
    latest &&
    `${latest.title} (${formatTime(latest.timestamp)}) ${
      latest.type === NOTIFICATION_TYPES.HIGH_GAS
        ? "⚠️ High Gas Detected!"
        : latest.type === NOTIFICATION_TYPES.SPOILED_ALERT
        ? "❌ Food Spoiled"
        : latest.type === NOTIFICATION_TYPES.COST_UPDATE
        ? "💰 Cost Updated"
        : latest.type === NOTIFICATION_TYPES.REMINDER
        ? "⏰ Reminder Active"
        : ""
    }`;

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      <Animated.View
        style={[
          styles.headerWrapper,
          { opacity: fadeAnim, transform: [{ translateY }] },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ translateY: parallaxShift }],
          }}
        >
          <BlurView
            intensity={isHeaderVisible ? 80 : 30}
            tint={theme === "light" ? "light" : "dark"}
            style={styles.blurContainer}
          >
            {/* Left: Avatar */}
            <TouchableOpacity
              style={styles.left}
              onPress={() => router.push("/profile")}
              activeOpacity={0.8}
            >
              <Image
                source={require("../assets/images/profile-avatar.png")}
                style={styles.avatar}
              />
            </TouchableOpacity>

            {/* Center: Brand */}
            <View style={styles.center}>
              <Text
                style={[
                  styles.brand,
                  { color: theme === "light" ? "#0f172a" : "#f8fafc" },
                ]}
              >
                FreshiFy 🍃
              </Text>
            </View>

            {/* Right: Theme + Notifications */}
            <View style={styles.right}>
              <ThemeToggle />
              <TouchableOpacity
                onPress={() => router.push("/notifications")}
                style={styles.iconButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="notifications-outline"
                  size={23}
                  color={
                    unreadCount > 0
                      ? "#facc15"
                      : theme === "light"
                      ? "#1e293b"
                      : "#f8fafc"
                  }
                />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </Animated.View>

      {latest && (
        <View
          style={[
            styles.alertBar,
            theme === "light"
              ? { backgroundColor: "#e0f2fe" }
              : { backgroundColor: "#334155" },
          ]}
        >
          <Text
            style={[
              styles.alertText,
              { color: theme === "light" ? "#111827" : "#f8fafc" },
            ]}
          >
            {latestText}
          </Text>
        </View>
      )}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 10,
  },
  blurContainer: {
    width: SCREEN_WIDTH,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 20 : 50,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flex: 0.2, alignItems: "flex-start" },
  center: { flex: 0.6, alignItems: "center" },
  right: { flex: 0.2, flexDirection: "row", justifyContent: "flex-end" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#94a3b8",
  },
  brand: { fontSize: 20, fontWeight: "800", letterSpacing: 0.5 },
  iconButton: { marginLeft: 14, position: "relative" },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  alertBar: {
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: { fontSize: 12, fontWeight: "500" },
});
