import { useEffect } from "react";
import { DimensionValue } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { motion, radius, useColors } from "../theme";

export default function Skeleton({ width = "100%", height = 20 }: { width?: DimensionValue; height?: number }) {
  const c = useColors();
  const o = useSharedValue(0.4);
  useEffect(() => { o.value = withRepeat(withTiming(1, { duration: motion.loadingOrbitMs / 2 }), -1, true); }, [o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View accessibilityElementsHidden importantForAccessibility="no"
    style={[{ width, height, borderRadius: radius.sm, backgroundColor: c.divider }, style]} />;
}
