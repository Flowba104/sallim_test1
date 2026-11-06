import { useEffect } from "react";
import { Text } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { motion, radius, shadow, space, typography, useColors } from "../theme";

// message가 있으면 표시, 일정 시간 뒤 onHide 호출. 부모가 message를 null로 돌려 닫는다.
export default function Toast({ message, onHide }: { message: string | null; onHide: () => void }) {
  const c = useColors();
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onHide, motion.toastMs);
    return () => clearTimeout(t);
  }, [message, onHide]);
  if (!message) return null;
  return (
    <Animated.View entering={FadeInDown.duration(motion.screenMs)} exiting={FadeOut} accessibilityLiveRegion="polite"
      style={{ position: "absolute", left: space.page, right: space.page, bottom: space.xl, padding: space.md, borderRadius: radius.button,
        backgroundColor: c.text, ...shadow.overlay }}>
      <Text style={{ ...typography.body, color: c.bg }}>{message}</Text>
    </Animated.View>
  );
}
