import React, { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutRectangle,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import Loader from "../components/Loader";
import { useTheme } from "../contexts/ThemeContext";

const DetectView = React.lazy(() => import("./detection/DetectView"));
const AnalyticsScreen = React.lazy(() => import("./AnalyticsScreen"));
const CostScreen = React.lazy(() => import("./CostScreen"));
const VeoView = React.lazy(() => import("./detection/SelectionView"));

type TabKey = "detect" | "analytics" | "cost" | "veo";
const TAB_CONFIG: { key: TabKey; label: string }[] = [
  { key: "detect", label: "Detect" },
  { key: "analytics", label: "Analytics" },
  { key: "cost", label: "Cost" },
  { key: "veo", label: "Modes" },
];
const SCREEN_WIDTH = Dimensions.get("window").width;

const DetectionScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>("detect");
  const [layouts, setLayouts] = useState<Record<TabKey, LayoutRectangle | null>>({
    detect: null,
    analytics: null,
    cost: null,
    veo: null,
  });
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  const onTabLayout = useCallback(
    (key: TabKey) => (ev: any) => {
      const layout: LayoutRectangle = ev.nativeEvent.layout;
      setLayouts((prev) => ({ ...prev, [key]: layout }));
    },
    []
  );

  useEffect(() => {
    const layout = layouts[activeTab];
    if (!layout) return;
    Animated.parallel([
      Animated.spring(indicatorX, { toValue: layout.x, useNativeDriver: false }),
      Animated.spring(indicatorWidth, { toValue: layout.width, useNativeDriver: false }),
    ]).start();
  }, [activeTab, layouts]);

  const indicatorStyle = useMemo(
    () => ({ left: indicatorX, width: indicatorWidth }),
    [indicatorX, indicatorWidth]
  );

  const renderContent = () => {
    switch (activeTab) {
      case "detect":
        return (
          <Suspense fallback={<Loader text="Loading Detect..." />}>
            <DetectView />
          </Suspense>
        );
      case "analytics":
        return (
          <Suspense fallback={<Loader text="Loading Analytics..." />}>
            <AnalyticsScreen />
          </Suspense>
        );
      case "cost":
        return (
          <Suspense fallback={<Loader text="Loading Cost..." />}>
            <CostScreen />
          </Suspense>
        );
      case "veo":
        return (
          <Suspense fallback={<Loader text="Loading Modes..." />}>
            <VeoView setMode={() => {}} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#f8fafc" : "#0f172a" },
      ]}
    >
      <View
        style={[
          styles.subHeader,
          {
            backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
            borderBottomColor: theme === "light" ? "#d1d5db" : "#334155",
          },
        ]}
      >
        <View style={styles.tabRow}>
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onLayout={onTabLayout(tab.key)}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.9}
                style={[
                  styles.tabButton,
                  isActive && {
                    backgroundColor:
                      theme === "light" ? "#e0f2fe" : "#2563eb22",
                    borderColor:
                      theme === "light" ? "#2563eb" : "#60a5fa",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive
                        ? theme === "light"
                          ? "#2563eb"
                          : "#60a5fa"
                        : theme === "light"
                        ? "#6b7280"
                        : "#94a3b8",
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            {
              backgroundColor:
                theme === "light" ? "#2563eb" : "#60a5fa",
            },
          ]}
        />
      </View>

      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
};

export default DetectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  subHeader: {
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 40) + 10 : 60,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
  },
  tabLabel: { fontSize: 15, fontWeight: "600" },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    borderRadius: 2,
  },
});
