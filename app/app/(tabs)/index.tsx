import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import Button from "../../components/Button";
import CategoryBadge from "../../components/CategoryBadge";
import CategoryIcon from "../../components/CategoryIcon";
import Chip from "../../components/Chip";
import ErrorState from "../../components/ErrorState";
import Sheet from "../../components/Sheet";
import Skeleton from "../../components/Skeleton";
import SourceDisclosure from "../../components/SourceDisclosure";
import { ApiError, getRegions, getSchedule, isMock } from "../../lib/api";
import type { ScheduleResponse } from "../../lib/api-types";
import { t } from "../../lib/copy";
import { getRecent, Recent } from "../../lib/recent";
import { useRegion } from "../../lib/useRegion";
import { motion, radius, sizes, space, typography, useColors } from "../../theme";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

export default function Home() {
  const c = useColors();
  const router = useRouter();
  const { width, fontScale } = useWindowDimensions();
  const regionId = useRegion();
  const [s, setS] = useState<ScheduleResponse | null>(null);
  const [err, setErr] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [regionName, setRegionName] = useState<string | null>(null);
  const [recent, setRecent] = useState<Recent[]>([]);

  const load = useCallback(() => {
    if (!regionId) return;
    setErr(null);
    setLoading(true);
    getSchedule(regionId)
      .then((r) => { setS(r); setDay((d) => d ?? r.today); })
      .catch((e) => setErr(e instanceof ApiError ? e : new ApiError("internal_error", String(e?.message ?? e))))
      .finally(() => setLoading(false));
  }, [regionId]);
  useEffect(load, [load]);
  useEffect(() => {
    if (!regionId) { setRegionName(null); return; }
    getRegions().then((rs) => setRegionName(rs.find((r) => r.id === regionId)?.name ?? null)).catch(() => {});
  }, [regionId]);
  useFocusEffect(useCallback(() => { getRecent().then(setRecent); }, []));

  // 다른 동네 데이터는 새 응답이 올 때까지 쓰지 않는다
  const data = s && s.region_id === regionId ? s : null;
  const cats = data?.today_categories ?? [];
  const wrap = width < 360 || fontScale > 1.3; // 요일 4+3행
  const sel = day ?? data?.today ?? "";

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: space.page, paddingTop: 0, gap: space.md }}>
        <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ ...typography.section, color: c.primary }}>SaLLiM</Text>
            <Text style={{ ...typography.caption, color: c.subtext }}>{t("home.slogan")}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={regionName ? `현재 동네 ${regionName}, 변경` : "동네 선택"} onPress={() => router.push("/region")}
            style={{ minHeight: sizes.touchMin, minWidth: sizes.touchMin, justifyContent: "center", alignItems: "flex-end" }}>
            <Text style={{ ...typography.label, color: c.primary }}>{regionName ?? t("home.pickRegion")}</Text>
          </Pressable>
        </View>

        <View>
          <Text style={{ ...typography.eyebrow, color: c.subtext }}>{t("home.eyebrow")}</Text>
          <Text accessibilityRole="header" style={{ ...typography.heading, color: c.text }}>{t("home.title")}</Text>
        </View>

        {regionId === null && (
          <View style={{ gap: space.smPlus, padding: space.page, borderRadius: radius.md, backgroundColor: c.tint }}>
            <Text style={{ ...typography.body, color: c.text }}>{t("home.noRegion")}</Text>
            <Button label={t("home.pickRegion")} onPress={() => router.push("/region")} />
          </View>
        )}

        {regionId && !data && !err && (
          <View accessible accessibilityLabel={t("home.loading")} style={{ gap: space.smPlus, padding: space.page, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, backgroundColor: c.surface, minHeight: 236 }}>
            <Skeleton width={80} height={20} />
            <Skeleton width={160} height={56} />
            <Skeleton height={32} />
            <Skeleton width={120} height={20} />
            <Text style={{ ...typography.caption, color: c.subtext }}>{t("home.loading")}</Text>
          </View>
        )}

        {err && data && err.code === "network" && (
          <Text accessibilityRole="alert" style={{ ...typography.caption, color: c.warn }}>{t("home.offlineCached")}</Text>
        )}
        {err && !(data && err.code === "network") && <ErrorState error={err} onRetry={load} retrying={loading} />}

        {data && (
          <Animated.View entering={FadeInDown.duration(motion.cardEnterMs)}
            style={{ minHeight: 236, gap: space.sm, padding: space.page, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, backgroundColor: c.surface }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <View style={{ width: space.sm, height: space.md, borderRadius: radius.xs, backgroundColor: c.accent }} />
              <Text style={{ ...typography.label, color: c.subtext }}>{t("home.today.label")}</Text>
            </View>
            <Text accessibilityLabel={`오늘은 ${data.today}요일`} style={{ ...typography.display, color: c.text }}>{data.today}요일</Text>
            {isMock && <Text style={{ ...typography.caption, color: c.error }}>{t("common.mockNotice")}</Text>}
            {cats.length === 0 ? (
              <Text style={{ ...typography.body, color: c.subtext }}>{t("home.today.empty")}</Text>
            ) : (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.smPlus }}>
                {cats.slice(0, 2).map((x) => <CategoryBadge key={x} category={x} />)}
                {cats.length > 2 && <Text style={{ ...typography.label, color: c.subtext, alignSelf: "center" }}>외 {cats.length - 2}종</Text>}
              </View>
            )}
            {cats.length > 2 && (
              <Pressable accessibilityRole="button" onPress={() => setSheet(true)} style={{ minHeight: sizes.touchMin, justifyContent: "center" }}>
                <Text style={{ ...typography.label, color: c.primary }}>{t("home.today.all")}</Text>
              </Pressable>
            )}
            <Text style={{ ...typography.label, color: c.text }}>{data.time ?? t("home.today.timeUnknown")}</Text>
            {loading && <Text style={{ ...typography.caption, color: c.subtext }}>{t("home.refreshing")}</Text>}
          </Animated.View>
        )}

        <Button label={t("home.action.capture")} disabled={!regionId} onPress={() => router.push("/capture")} />

        {data && (
          <View style={{ gap: space.smPlus, marginTop: space.sm }}>
            <Text accessibilityRole="header" style={{ ...typography.section, color: c.text }}>{t("home.week.title")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.xxs }}>
              {DAYS.map((d) => (
                <View key={d} style={{ flexGrow: 1, flexBasis: wrap ? "23%" : "12%", minWidth: sizes.touchMin }}>
                  <Chip compact label={d} sub={d === data.today ? "오늘" : undefined} selected={d === sel} onPress={() => setDay(d)} />
                </View>
              ))}
            </View>
            <View style={{ gap: space.sm, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, backgroundColor: c.surface }}>
              <Text style={{ ...typography.label, color: c.subtext }}>{sel}요일</Text>
              {(data.week[sel] ?? []).length === 0
                ? <Text style={{ ...typography.body, color: c.subtext }}>{t("home.today.empty")}</Text>
                : <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>{data.week[sel].map((x) => <CategoryBadge key={x} category={x} />)}</View>}
            </View>
            {data.note && <Text style={{ ...typography.caption, color: c.subtext }}>{data.note}</Text>}
          </View>
        )}

        <View style={{ gap: space.sm, marginTop: space.sm }}>
          <Text accessibilityRole="header" style={{ ...typography.section, color: c.text }}>{t("home.recent.title")}</Text>
          {recent.length === 0 && <Text style={{ ...typography.body, color: c.subtext }}>{t("home.recent.empty")}</Text>}
          {recent.map((r) => (
            <Pressable key={r.item_key + r.region_id} accessibilityRole="button" onPress={() => router.push({ pathname: "/ask", params: { q: r.item_name } })}
              style={({ pressed }) => ({ minHeight: 72, flexDirection: "row", alignItems: "center", gap: space.smPlus, padding: space.md, borderRadius: radius.md,
                borderWidth: 1, borderColor: c.divider, backgroundColor: pressed ? c.surfacePressed : c.surface })}>
              <CategoryIcon category={r.category} size={sizes.iconDefault} color={c.primary} />
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.body, color: c.text }}>{r.item_name}</Text>
                <Text style={{ ...typography.caption, color: c.subtext }}>{r.category}{r.region_id !== regionId ? " · 이전 동네" : ""}</Text>
              </View>
              <Text style={{ ...typography.section, color: c.subtext }}>›</Text>
            </Pressable>
          ))}
        </View>

        {data && <SourceDisclosure sources={data.sources} />}
      </ScrollView>

      <Sheet visible={sheet} onClose={() => setSheet(false)}>
        <Text accessibilityRole="header" style={{ ...typography.section, color: c.text }}>{t("home.today.sheetTitle")}</Text>
        {cats.map((x) => (
          <View key={x} style={{ minHeight: sizes.touchMin, flexDirection: "row", alignItems: "center", gap: space.smPlus }}>
            <CategoryIcon category={x} size={sizes.iconDefault} color={c.primary} />
            <Text style={{ ...typography.body, color: c.text }}>{x}</Text>
          </View>
        ))}
      </Sheet>
    </SafeAreaView>
  );
}
