// types/module-fixes.d.ts
declare module "react-native-shimmer-placeholder" {
  import * as React from "react";
  import { ViewStyle, StyleProp } from "react-native";
  import { LinearGradient } from "expo-linear-gradient";

  interface ShimmerPlaceholderProps {
    LinearGradient: typeof LinearGradient;
    style?: StyleProp<ViewStyle>;
    visible?: boolean;
    shimmerColors?: string[];
  }

  const ShimmerPlaceholder: React.FC<ShimmerPlaceholderProps>;
  export default ShimmerPlaceholder;
}

declare module "expo-linear-gradient" {
  import { LinearGradient as LG } from "expo-linear-gradient";
  export const LinearGradient: typeof LG;
}
