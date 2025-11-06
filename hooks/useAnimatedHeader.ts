import { useState, useRef } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

/**
 * Custom hook for managing animated header visibility and refresh control
 */
export default function useAnimatedHeader() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollOffset = useRef(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset.current;
    if (Math.abs(diff) > 8) {
      setIsHeaderVisible(diff < 0 || currentOffset < 50);
      scrollOffset.current = currentOffset;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return { isHeaderVisible, handleScroll, refreshing, onRefresh };
}
