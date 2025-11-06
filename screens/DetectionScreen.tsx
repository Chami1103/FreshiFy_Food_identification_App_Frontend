import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutRectangle,
  Dimensions,
} from "react-native";
import Loader from "../components/Loader";

// Lazy-load sub-screens
const DetectView = React.lazy(() => import("./detection/DetectView"));
const AnalyticsScreen = React.lazy(() => import("./AnalyticsScreen"));
const CostScreen = React.lazy(() => import("./CostScreen"));
const VeoView = React.lazy(() => import("./detection/SelectionView"));

type TabKey = "detect" | "analytics" | "cost" | "veo";

const TAB_CONFIG: { key: TabKey; label: string }[] = [
  { key: "detect", label: "Detect" },
  { key: "analytics", label: "Analytics" },
  { key: "cost", label: "Cost" },
  { key: "veo", label: "Veo" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;

const DetectionScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("detect");
  const [layouts, setLayouts] = useState<
    Record<TabKey, LayoutRectangle | null>
  >({
    detect: null,
    analytics: null,
    cost: null,
    veo: null,
  });

  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const measuredCount = useRef(0);

  const onTabLayout = useCallback(
    (key: TabKey) => (ev: any) => {
      const layout: LayoutRectangle = ev.nativeEvent.layout;
      setLayouts((prev) => {
        const next = { ...prev, [key]: layout };
        measuredCount.current = Object.values(next).filter(Boolean).length;
        return next;
      });
    },
    []
  );

  useEffect(() => {
    const layout = layouts[activeTab];
    if (!layout) {
      const idx = TAB_CONFIG.findIndex((t) => t.key === activeTab);
      const fallbackWidth = Math.round(SCREEN_WIDTH / TAB_CONFIG.length) - 24;
      const fallbackX = Math.round((SCREEN_WIDTH / TAB_CONFIG.length) * idx + 12);
      Animated.parallel([
        Animated.spring(indicatorX, {
          toValue: fallbackX,
          useNativeDriver: false,
          tension: 120,
          friction: 12,
        }),
        Animated.spring(indicatorWidth, {
          toValue: fallbackWidth,
          useNativeDriver: false,
          tension: 120,
          friction: 12,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: layout.x,
        useNativeDriver: false,
        tension: 120,
        friction: 12,
      }),
      Animated.spring(indicatorWidth, {
        toValue: layout.width,
        useNativeDriver: false,
        tension: 120,
        friction: 12,
      }),
    ]).start();
  }, [activeTab, layouts, indicatorX, indicatorWidth]);

  useEffect(() => {
    if (measuredCount.current >= TAB_CONFIG.length) {
      const layout = layouts[activeTab];
      if (layout) {
        indicatorX.setValue(layout.x);
        indicatorWidth.setValue(layout.width);
      }
    }
  }, [layouts]);

  const renderContent = useCallback(() => {
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
          <Suspense fallback={<Loader text="Loading Veo..." />}>
            {/* ✅ FIX: Added required prop */}
            <VeoView setMode={() => {}} />
          </Suspense>
        );
      default:
        return null;
    }
  }, [activeTab]);

  const indicatorStyle = useMemo(
    () => ({
      left: indicatorX,
      width: indicatorWidth,
    }),
    [indicatorX, indicatorWidth]
  );

  return (
    <View style={styles.container}>
      {/* Subheader Tabs */}
      <View style={styles.subHeaderContainer}>
        <View style={styles.tabRow}>
          {TAB_CONFIG.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                onLayout={onTabLayout(tab.key)}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Animated indicator */}
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      </View>

      <View style={styles.contentWrap}>{renderContent()}</View>
    </View>
  );
};

export default DetectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  subHeaderContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e6e6e6",
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1 }],
  },
  tabButtonActive: {
    transform: [{ scale: 1.02 }],
  },
  tabLabel: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  tabLabelActive: {
    color: "#0ea5a0",
  },
  indicator: {
    position: "absolute",
    height: 3,
    bottom: 0,
    backgroundColor: "#10b981",
    borderRadius: 2,
  },
  contentWrap: {
    flex: 1,
  },
});
