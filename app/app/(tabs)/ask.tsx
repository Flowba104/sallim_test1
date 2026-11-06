import { ComponentRef, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import Button from "../../components/Button";
import Chip from "../../components/Chip";
import ResultCard from "../../components/ResultCard";
import ErrorState from "../../components/ErrorState";
import ResultSkeleton from "../../components/ResultSkeleton";
import { ApiError, ask } from "../../lib/api";
import type { AskResponse } from "../../lib/api-types";
import { t } from "../../lib/copy";
import { addRecent } from "../../lib/recent";
import { SUGGESTIONS } from "../../lib/suggestions";
import { useRegion } from "../../lib/useRegion";
import { useScheme, motion, radius, sizes, space, typography, useColors } from "../../theme";

export default function Ask() {
  const c = useColors();
  const dark = useScheme() === "dark";
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const regionId = useRegion();
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [emptyErr, setEmptyErr] = useState(false);
  const [err, setErr] = useState<ApiError | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [more, setMore] = useState(false);
  const [n, setN] = useState(0); // 새 질문마다 ResultCard 리마운트(누적 답 초기화)
  const resultY = useRef(0);
  const job = useRef(0); // 취소 후 늦게 온 응답 무시용

  useEffect(() => { if (params.q) setQ(String(params.q)); }, [params.q]);

  async function submit() {
    if (!regionId || busy) return;
    if (!q.trim()) { setEmptyErr(true); input.current?.focus(); return; }
    const mine = ++job.current;
    setErr(null); setResult(null); setBusy(true);
    try {
      const r = await ask({ region_id: regionId, question: q.trim() });
      if (mine !== job.current) return;
      setResult(r); setN((x) => x + 1);
      if (r.item_key && r.item_name) addRecent({ item_key: r.item_key, item_name: r.item_name, category: r.category, region_id: regionId });
      setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, resultY.current - space.md), animated: true }), 150);
    } catch (e) {
      if (mine === job.current) setErr(e instanceof ApiError ? e : new ApiError("internal_error", ""));
    } finally {
      if (mine === job.current) setBusy(false);
    }
  }

  const cancel = () => { job.current++; setBusy(false); };
  const chips = more ? SUGGESTIONS : SUGGESTIONS.slice(0, 6);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.page, gap: space.md }}>
        <View style={{ gap: space.sm }}>
          <Text style={{ ...typography.eyebrow, color: c.subtext }}>{t("ask.header")}</Text>
          <Text accessibilityRole="header" style={{ ...typography.resultTitle, color: c.text }}>{t("ask.title")}</Text>
        </View>

        {regionId === null && (
          <View style={{ gap: space.smPlus, padding: space.md, borderRadius: radius.md, backgroundColor: c.tint }}>
            <Text style={{ ...typography.body, color: c.text }}>{t("ask.noRegion")}</Text>
            <Button label={t("home.pickRegion")} onPress={() => router.push("/region")} />
          </View>
        )}

        <View style={{ gap: space.sm }}>
          <Text style={{ ...typography.label, color: c.text }}>{t("ask.input.label")}</Text>
          <TextInput ref={input} value={q} onChangeText={(v) => { setQ(v); setEmptyErr(false); }} multiline
            placeholder={t("ask.placeholder")} placeholderTextColor={c.placeholder} accessibilityLabel={t("ask.input.label")}
            keyboardAppearance={dark ? "dark" : "light"} editable={!!regionId}
            style={{ ...typography.body, minHeight: 120, textAlignVertical: "top", padding: space.input, borderWidth: emptyErr ? 2 : 1,
              borderColor: emptyErr ? c.error : c.border, borderRadius: radius.button, backgroundColor: c.surface, color: c.text }} />
          <Text style={{ ...typography.caption, color: c.subtext }}>{t("ask.input.hint")}</Text>
          {q.length > 0 && <Button variant="secondary" label={t("ask.clear")} haptic={false} onPress={() => { setQ(""); input.current?.focus(); }} />}
          {emptyErr && <Text accessibilityRole="alert" style={{ ...typography.caption, color: c.error }}>{t("ask.input.errorEmpty")}</Text>}
        </View>
        <Button label={busy ? t("ask.loading") : t("ask.submit")} busy={busy} disabled={!regionId || !q.trim()} onPress={submit} />

        <View style={{ gap: space.smPlus }}>
          <Text accessibilityRole="header" style={{ ...typography.section, color: c.text }}>{t("ask.chips.title")}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
            {chips.map((s) => <Chip key={s} label={s} onPress={() => { setQ(s); setEmptyErr(false); input.current?.focus(); }} />)}
            {!more && <Chip label="더 보기" onPress={() => setMore(true)} />}
          </View>
        </View>

        {busy && (
          <>
            <ResultSkeleton label={t("status.loading.question")} />
            <Button variant="secondary" label={t("capture.scanning.cancel")} haptic={false} onPress={cancel} />
          </>
        )}
        {err && <ErrorState error={err} onRetry={submit} retrying={busy} onEdit={() => input.current?.focus()} />}
        {result && regionId && (
          <Animated.View entering={FadeInDown.duration(motion.cardEnterMs)} onLayout={(e) => { resultY.current = e.nativeEvent.layout.y; }}>
            <ResultCard key={n} result={result} regionId={regionId} onChange={setResult} onRetake={() => router.push("/capture")} />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
