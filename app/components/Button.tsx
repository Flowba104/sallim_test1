import { Pressable, Text, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { radius, sizes, space, typography, useColors } from "../theme";

type Props = {
  label: string; onPress: () => void; variant?: "primary" | "secondary";
  disabled?: boolean; busy?: boolean; haptic?: boolean;
};

export default function Button({ label, onPress, variant = "primary", disabled, busy, haptic = true }: Props) {
  const c = useColors();
  const off = disabled || busy;
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!off, busy: !!busy }}
      disabled={off}
      onPress={() => { if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); onPress(); }}
      style={({ pressed }) => ({
        minHeight: sizes.buttonMinHeight, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: space.sm,
        paddingHorizontal: space.md, paddingVertical: space.smPlus, borderRadius: radius.button,
        borderWidth: primary ? 0 : 1, borderColor: c.border,
        backgroundColor: off ? c.disabledBg : primary ? (pressed ? c.primaryPressed : c.primary) : pressed ? c.tint : c.surface,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      {busy && <ActivityIndicator color={c.disabledText} />}
      <Text style={{ ...typography.button, color: off ? c.disabledText : primary ? c.onPrimary : c.text }}>{label}</Text>
    </Pressable>
  );
}
