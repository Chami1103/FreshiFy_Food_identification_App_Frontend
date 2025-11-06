import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNotifications } from "../contexts/NotificationContext";
import { AppNotification, NotificationType } from "../types";
import {
  InfoIcon,
  AlertCircleIcon,
  XIcon,
  CheckCircleIcon,
} from "./icons/Icons";

const NOTIFICATION_TIMEOUT = 5000;

interface ToastProps {
  notification: AppNotification;
  onDismiss: () => void;
}

const NotificationToast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 400);
    }, NOTIFICATION_TIMEOUT);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const typeStyles: Record<
    NotificationType,
    { icon: React.ReactElement; bg: string; border: string }
  > = {
    success: {
      icon: <CheckCircleIcon color="#10b981" />,
      bg: "rgba(16,185,129,0.1)",
      border: "#10b981",
    },
    error: {
      icon: <AlertCircleIcon color="#ef4444" />,
      bg: "rgba(239,68,68,0.1)",
      border: "#ef4444",
    },
    info: {
      icon: <InfoIcon color="#0ea5e9" />,
      bg: "rgba(14,165,233,0.1)",
      border: "#0ea5e9",
    },
    alert: {
      icon: <AlertCircleIcon color="#facc15" />,
      bg: "rgba(250,204,21,0.1)",
      border: "#facc15",
    },

    // ✅ Added extended custom notification types
    spoiled_alert: {
      icon: <AlertCircleIcon color="#dc2626" />,
      bg: "rgba(239,68,68,0.15)",
      border: "#dc2626",
    },
    cost_update: {
      icon: <InfoIcon color="#3b82f6" />,
      bg: "rgba(59,130,246,0.15)",
      border: "#3b82f6",
    },
    high_gas: {
      icon: <AlertCircleIcon color="#f97316" />,
      bg: "rgba(249,115,22,0.15)",
      border: "#f97316",
    },
    reminder: {
      icon: <CheckCircleIcon color="#22c55e" />,
      bg: "rgba(34,197,94,0.15)",
      border: "#22c55e",
    },
  };

  const style = typeStyles[notification.type];

  return (
    <View
      style={{
        borderLeftWidth: 4,
        borderLeftColor: style.border,
        backgroundColor: style.bg,
        marginVertical: 5,
        borderRadius: 8,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        opacity: isExiting ? 0.5 : 1,
      }}
    >
      {style.icon}
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={{ fontWeight: "700", color: "#111" }}>
          {notification.title}
        </Text>
        <Text style={{ fontSize: 13, color: "#333" }}>
          {notification.message}
        </Text>
      </View>
      <TouchableOpacity onPress={onDismiss}>
        <XIcon color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  return (
    <View
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        zIndex: 999,
      }}
    >
      {notifications.map((n) => (
        <NotificationToast
          key={n.id}
          notification={n}
          onDismiss={() => removeNotification(n.id)}
        />
      ))}
    </View>
  );
};

export default NotificationContainer;
