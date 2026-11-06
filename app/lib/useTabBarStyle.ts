import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sizes, useColors } from "../theme";

// 탭바 높이 70 + 하단 inset. 레이아웃과 촬영 결과 단계(탭바 복원)가 같이 쓴다.
export function useTabBarStyle() {
  const c = useColors();
  const { bottom } = useSafeAreaInsets();
  return { height: sizes.tabBarMinHeight + bottom, paddingBottom: bottom, paddingTop: 8, backgroundColor: c.surface, borderTopColor: c.divider, borderTopWidth: 1 };
}
