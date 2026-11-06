import { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import { motion } from "../theme";

// 눌림 scale 0.98 / 100ms standard. 시스템 reduced motion이면 고정 1.
export function usePressScale() {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const to = (v: number) => { s.value = withTiming(reduce ? 1 : v, { duration: motion.pressMs, easing: Easing.bezier(...motion.easing.standard) }); };
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return { style, onPressIn: () => to(motion.pressScale), onPressOut: () => to(1) };
}
