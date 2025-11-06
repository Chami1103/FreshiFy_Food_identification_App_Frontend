import React from "react";
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  keyboardType?: "default" | "numeric" | "email-address";
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  inputStyle,
  keyboardType = "default",
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[styles.input, inputStyle]}
        keyboardType={keyboardType}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, color: "#334155", marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fff",
  },
});
