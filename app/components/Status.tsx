import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, sizes, space } from "../theme";

export function Loading() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.primary} />
      <Text style={{ color: colors.text }}>확인하는 중이에요</Text>
    </View>
  );
}

export function Btn({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled }} onPress={onPress} disabled={disabled}
      style={{
        minHeight: sizes.buttonMinHeight, justifyContent: "center", padding: space.md,
        borderWidth: 1, borderColor: colors.border, borderRadius: radius.button,
        backgroundColor: disabled ? colors.disabledBg : colors.surface,
      }}>
      <Text style={{ color: disabled ? colors.disabledText : colors.text }}>{label}</Text>
    </TouchableOpacity>
  );
}

// 새 결과를 못 받았음을 알리고 같은 요청을 다시 보낼 수 있게 한다 (입력은 부모가 유지)
export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={{ gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.errorBg }}>
      <Text style={{ color: colors.error, fontWeight: "700" }}>결과를 받지 못했어요</Text>
      <Text style={{ color: colors.error }}>{message}</Text>
      {onRetry && <Btn label="다시 시도" onPress={onRetry} />}
    </View>
  );
}
