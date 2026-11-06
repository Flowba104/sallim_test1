import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ReducedMotionConfig, ReduceMotion } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useColors, motion } from "../theme";
import { applyThemePref, loadThemePref } from "../lib/themePref";

export default function RootLayout() {
  const c = useColors();
  const [loaded, error] = useFonts({
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
  });
  useEffect(() => { loadThemePref().then(applyThemePref); }, []);
  // 로딩 중엔 네이티브 스플래시가 유지됨. 실패해도 시스템 폰트로 진행.
  if (!loaded && !error) return null;
  return (
    <>
      <ReducedMotionConfig mode={ReduceMotion.System} />
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", animationDuration: motion.screenMs, contentStyle: { backgroundColor: c.bg } }} />
    </>
  );
}
