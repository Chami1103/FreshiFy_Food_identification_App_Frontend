import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Easing,
  StatusBar,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

const Header: React.FC<HeaderProps> = ({ isHeaderVisible }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const title = pathname.includes("recipes")
    ? "Recipes"
    : pathname.includes("shelf")
    ? "Shelf"
    : pathname.includes("storage")
    ? "Storage"
    : pathname.includes("analytics")
    ? "Analytics"
    : pathname.includes("detection")
    ? "Detection"
    : "Dashboard";

  // 🔔 Fetch notifications every 10 seconds
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.warn("Header Notification Error:", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🎞️ Animate header visibility
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isHeaderVisible ? 1 : 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: isHeaderVisible ? 0 : -80,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
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
      <StatusBar hidden translucent backgroundColor="transparent" />

      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY }] },
        ]}
      >
        {/* 🍃 Logo & Title */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          activeOpacity={0.7}
          style={styles.logoContainer}
        >
          <Text style={styles.logoEmoji}>🍃</Text>
          <Text style={styles.logoText}>FreshiFy</Text>
          <Text style={styles.pageTitle}> / {title}</Text>
        </TouchableOpacity>

        {/* Right Icons */}
        <View style={styles.rightContainer}>
          <ThemeToggle />

          <TouchableOpacity
            onPress={() => router.push("/blog")}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="newspaper-outline" size={24} color="#2563eb" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={[styles.iconButton, { position: "relative" }]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={unreadCount > 0 ? "#facc15" : "#64748b"}
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Inline Alert for Latest Notification */}
      {latest && (
        <View
          style={[
            styles.alertBar,
            latest.type === NOTIFICATION_TYPES.HIGH_GAS
              ? { backgroundColor: "#fee2e2" }
              : latest.type === NOTIFICATION_TYPES.SPOILED_ALERT
              ? { backgroundColor: "#fef3c7" }
              : latest.type === NOTIFICATION_TYPES.COST_UPDATE
              ? { backgroundColor: "#d1fae5" }
              : { backgroundColor: "#e0f2fe" },
          ]}
        >
          <Text style={styles.alertText}>{latestText}</Text>
        </View>
      )}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottomColor: "rgba(229,231,235,0.6)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 50,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoEmoji: { fontSize: 26, marginRight: 6 },
  logoText: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  pageTitle: { fontSize: 16, fontWeight: "600", color: "#2563eb", marginLeft: 4 },
  rightContainer: { flexDirection: "row", alignItems: "center" },
  iconButton: { marginLeft: 16 },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  alertBar: {
    marginTop: 62,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: { color: "#111827", fontSize: 12, textAlign: "center" },
});
