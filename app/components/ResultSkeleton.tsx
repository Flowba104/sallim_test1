import { View } from "react-native";
import Skeleton from "./Skeleton";
import { radius, sizes, space, useColors } from "../theme";

// 결과 카드 모양 skeleton (헤더·제목·본문·단계 3·일정). 가짜 %/남은 시간 없음.
export default function ResultSkeleton({ label }: { label: string }) {
  const c = useColors();
  return (
    <View accessible accessibilityLabel={label} accessibilityLiveRegion="polite"
      style={{ gap: space.md, padding: space.page, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, backgroundColor: c.surface }}>
      <Skeleton height={32} />
      <Skeleton width="78%" height={36} />
      <Skeleton height={16} /><Skeleton height={16} />
      {[0, 1, 2].map((i) => <Skeleton key={i} height={sizes.buttonMinHeight} />)}
      <Skeleton height={100} />
    </View>
  );
}
