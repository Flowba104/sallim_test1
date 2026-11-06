import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";
import { radius, sizes, space, typography, useColors } from "../theme";

// 누를 수 있는 칩(자주 묻는 품목, 요일). selected는 색+굵기로 구분.
export default function Chip({ label, onPress, selected }: { label: string; onPress?: () => void; selected?: boolean }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!selected }} onPress={() => { Haptics.selectionAsync().catch(() => {}); onPress?.(); }}
      style={({ pressed }) => ({ minHeight: sizes.touchAbsoluteMin, minWidth: sizes.touchAbsoluteMin, justifyContent: "center", alignItems: "center",
        paddingHorizontal: space.smPlus, borderRadius: radius.pill, borderWidth: 1,
        borderColor: selected ? c.primary : c.border,
        backgroundColor: selected ? c.primary : pressed ? c.surfacePressed : c.surface,
        transform: [{ scale: pressed ? 0.98 : 1 }] })}>
      <Text style={{ ...typography.label, fontWeight: selected ? "700" : "500", color: selected ? c.onPrimary : c.text }}>{label}</Text>
    </Pressable>
  );
}
