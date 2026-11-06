import { ReactNode, useEffect } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import StateIcon, { StateKind } from "./StateIcon";
import { radius, space, typography, useColors } from "../theme";

// 상태 화면 공통 프레임: 아이콘 + 제목 + 설명 + 다음 행동. tone=error면 errorBg.
export default function StatusCard({ kind, title, body, tone = "tint", children }: {
  kind: StateKind; title: string; body?: string; tone?: "tint" | "error"; children?: ReactNode;
}) {
  const c = useColors();
  const err = tone === "error";
  useEffect(() => { if (err) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}); }, [err]);
  const fg = err ? c.error : c.text;
  return (
    <Animated.View entering={FadeIn.duration(180)} accessibilityRole="alert" accessibilityLiveRegion="polite"
      style={{ gap: space.md, padding: space.lg, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, backgroundColor: err ? c.errorBg : c.tint }}>
      <StateIcon kind={kind} color={fg} />
      <Text accessibilityRole="header" style={{ ...typography.resultTitle, color: fg }}>{title}</Text>
      {body && <Text style={{ ...typography.body, color: err ? c.error : c.subtext }}>{body}</Text>}
      {children && <View style={{ gap: space.smPlus }}>{children}</View>}
    </Animated.View>
  );
}
