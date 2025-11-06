import React from "react";
import { View, StyleSheet, DimensionValue } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  height?: number;
  width?: DimensionValue;
  borderRadius?: number;
  count?: number;
}

const ShimmerCard: React.FC<Props> = ({
  height = 100,
  width = "100%",
  borderRadius = 12,
  count = 1,
}) => {
  const shimmerItems = Array.from({ length: count });

  return (
    <View>
      {shimmerItems.map((_, idx) => (
        <ShimmerPlaceholder
          key={idx}
          LinearGradient={LinearGradient}
          style={[
            styles.shimmer,
            {
              height,
              width,
              borderRadius,
              marginBottom: 12,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: "#e5e7eb",
  },
});

export default ShimmerCard;
