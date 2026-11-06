import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { useColors } from "../../theme";
import { getRegionId, isOnboarded } from "../../lib/region";

export default function TabsLayout() {
  const router = useRouter();
  const c = useColors();
  // 첫 실행: 온보딩 → 동네 선택. 온보딩만 끝내고 나간 경우 동네 선택으로.
  useEffect(() => {
    (async () => {
      if (!(await isOnboarded())) router.replace("/onboarding");
      else if (!(await getRegionId())) router.replace("/region");
    })();
  }, [router]);
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: c.primary, tabBarStyle: { backgroundColor: c.surface }, sceneStyle: { backgroundColor: c.bg } }}>
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="capture" options={{ title: "찍기", tabBarStyle: { display: "none" } }} />
      <Tabs.Screen name="ask" options={{ title: "물어보기" }} />
      <Tabs.Screen name="settings" options={{ title: "설정" }} />
    </Tabs>
  );
}
