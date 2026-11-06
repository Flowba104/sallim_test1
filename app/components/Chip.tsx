import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";
import Animated from "react-native-reanimated";
import { usePressScale } from "../lib/usePressScale";
import { radius, sizes, space, typography, useColors } from "../theme";

// 누를 수 있는 칩(자주 묻는 품목, 요일). selected는 색+굵기로 구분.
export default function Chip({ label, sub, onPress, selected, compact }: { label: string; sub?: string; onPress?: () => void; selected?: boolean; compact?: boolean }) {
  const c = useColors();
  const press = usePressScale();
  return (
    <Animated.View style={press.style}>
    <Pressable onPressIn={press.onPressIn} onPressOut={press.onPressOut} accessibilityRole="button" accessibilityState={{ selected: !!selected }} onPress={() => { Haptics.selectionAsync().catch(() => {}); onPress?.(); }}
      style={({ pressed }) => ({ minHeight: sizes.touchMin, minWidth: sizes.touchMin, justifyContent: "center", alignItems: "center",
        paddingHorizontal: compact ? space.xs : space.smPlus, borderRadius: radius.pill, borderWidth: selected ? 2 : 1,
        borderColor: selected ? c.primary : c.border,
        backgroundColor: selected ? c.primary : pressed ? c.surfacePressed : c.surface })}>
      <Text style={{ ...typography.label, fontFamily: selected ? typography.bodyStrong.fontFamily : typography.label.fontFamily, color: selected ? c.onPrimary : c.text }}>{label}</Text>
      {sub && <Text style={{ ...typography.caption, color: selected ? c.onPrimary : c.subtext }}>{sub}</Text>}
    </Pressable>
    </Animated.View>
  );
}
