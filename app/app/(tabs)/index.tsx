import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ErrorBox, Loading } from "../../components/Status";
import { getSchedule, isMock } from "../../lib/api";
import type { ScheduleResponse } from "../../lib/api-types";
import { useRegion } from "../../lib/useRegion";
import CategoryIcon from "../../components/CategoryIcon";
import { colors, radius, space, typography } from "../../theme";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function Home() {
  const regionId = useRegion();
  const [s, setS] = useState<ScheduleResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!regionId) return;
    setErr(null);
    getSchedule(regionId).then(setS).catch((e) => setErr(e.message ?? "오류가 났어요"));
  }, [regionId]);
  useEffect(load, [load]);

  if (regionId === null) return <Text style={{ padding: space.md }}>설정 탭에서 동네를 먼저 골라 주세요.</Text>;
  return (
    <ScrollView contentContainerStyle={{ padding: space.md, gap: space.sm }} style={{ backgroundColor: colors.bg }}>
      {!s && !err && <Loading />}
      {err && <ErrorBox message={err} onRetry={load} />}
      {s && (
        <>
          {isMock && <Text style={{ color: colors.warn }}>예시 데이터예요 (실제 배출 요일이 아니에요)</Text>}
          <Text style={{ ...typography.section, fontWeight: "700", color: colors.text }}>
            {s.today_categories.length
              ? `오늘(${s.today})은 ${s.today_categories.join(", ")} 내놓는 날`
              : `오늘(${s.today})은 내놓는 품목이 없어요`}
          </Text>
          {s.today_categories.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
              {s.today_categories.map((c) => (
                <View key={c} style={{ flexDirection: "row", alignItems: "center", gap: space.xs, paddingHorizontal: 10,
                  paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.tint }}>
                  <CategoryIcon category={c} size={20} />
                  <Text style={{ color: colors.primary }}>{c}</Text>
                </View>
              ))}
            </View>
          )}
          {s.time && <Text style={{ color: colors.subtext }}>배출 시간 {s.time}</Text>}
          {DAYS.map((d) => (
            <View key={d} style={{ flexDirection: "row", gap: space.md }}>
              <Text style={{ width: 24, fontWeight: d === s.today ? "700" : "400" }}>{d}</Text>
              <Text style={{ flex: 1, color: colors.text }}>{s.week[d]?.join(", ") || "-"}</Text>
            </View>
          ))}
          {s.note && <Text style={{ color: colors.subtext, ...typography.caption }}>{s.note}</Text>}
          {s.sources.map((x) => (
            <Text key={x.url} style={{ color: colors.subtext, ...typography.caption }}>출처: {x.title} ({x.updated})</Text>
          ))}
        </>
      )}
    </ScrollView>
  );
}
