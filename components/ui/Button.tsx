import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = "primary",
  disabled = false,
}) => {
  const backgroundColor =
    variant === "primary"
      ? "#2563eb"
      : variant === "secondary"
      ? "#10b981"
      : "#ef4444";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? "#9ca3af" : backgroundColor },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
