// components/ThemeToggle.tsx
import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, Easing, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { SunIcon, MoonIcon } from "./icons/Icons";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Animation for smooth transition
  const rotateAnim = useRef(new Animated.Value(theme === "light" ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: theme === "light" ? 0 : 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [theme]);

  // Interpolate rotation & opacity
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const sunOpacity = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const moonOpacity = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      style={styles.button}
      accessibilityLabel={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Animated rotation container */}
      <Animated.View
        style={{
          transform: [{ rotate: rotateInterpolate }],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View style={[styles.iconWrapper, { opacity: sunOpacity }]}>
          <SunIcon width={24} height={24} color="#facc15" />
        </Animated.View>
        <Animated.View style={[styles.iconWrapper, { opacity: moonOpacity, position: "absolute" }]}>
          <MoonIcon width={24} height={24} color="#fbbf24" />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(226,232,240,0.4)", // light gray backdrop
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
