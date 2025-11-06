// E:\FreshiFy_Mobile_App_Frontend\components\Loader.tsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

interface LoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading...", size = "md", color = "#10b981" }) => {
  const indicatorSize = size === "sm" ? "small" : "large";

  return (
    <View style={styles.container}>
      <ActivityIndicator size={indicatorSize} color={color} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#10b981",
    fontWeight: "500",
    textAlign: "center",
  },
});
