import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { colors } from "../../theme";
import { getRegionId } from "../../lib/region";

export default function TabsLayout() {
  const router = useRouter();
  // 첫 실행: 동네가 없으면 설정(동네 선택)으로
  useEffect(() => { getRegionId().then((id) => { if (!id) router.replace("/settings"); }); }, [router]);
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary, tabBarStyle: { backgroundColor: colors.surface }, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="capture" options={{ title: "찍기" }} />
      <Tabs.Screen name="ask" options={{ title: "물어보기" }} />
      <Tabs.Screen name="settings" options={{ title: "설정" }} />
    </Tabs>
  );
}
