import { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ApiError, followUp, isMock } from "../lib/api";
import type { AskResponse, ItemState } from "../lib/api-types";
import { t } from "../lib/copy";
import Button from "./Button";
import CategoryIcon from "./CategoryIcon";
import Sheet from "./Sheet";
import StatusCard from "./StatusCard";
import SourceDisclosure from "./SourceDisclosure";
import { motion, radius, sizes, space, typography, useCategoryColors, useColors } from "../theme";

type Props = { result: AskResponse; regionId: string; onChange: (r: AskResponse) => void; onRetake?: () => void };

export default function ResultCard({ result: r, regionId, onChange, onRetake }: Props) {
  const c = useColors();
  const cat = useCategoryColors(r.category);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<boolean | null>(null); // 처리 중인 답(true=예)
  const [err, setErr] = useState(false);
  // 지금까지의 되묻기 답 누적 — false도 유지. 새 /ask 결과는 부모가 key로 리마운트해 초기화
  const [state, setState] = useState<ItemState>({});

  async function answer(yes: boolean) {
    if (!r.item_key || !r.follow_up || busy !== null) return;
    const next = { ...state, [r.follow_up.key]: yes };
    setErr(false);
    setBusy(yes);
    Haptics.selectionAsync().catch(() => {});
    try {
      const nr = await followUp({ region_id: regionId, item_key: r.item_key, state: next });
      setState(next);
      onChange(nr);
      if (!nr.follow_up) setOpen(false);
    } catch (e) {
      setErr(true);
      if (!(e instanceof ApiError)) console.warn(e);
    } finally {
      setBusy(null);
    }
  }

  const known = !!r.item_key && !!r.item_name;
  if (!known) {
    return (
      <StatusCard kind="unknown" title={t("result.unknown.title")} body={t("result.unknown.body")}>
        <Button label={t("result.unknown.retryPhoto")} onPress={() => (onRetake ? onRetake() : router.push("/capture"))} />
        <Button variant="secondary" label={t("result.unknown.askText")} haptic={false} onPress={() => router.push("/ask")} />
      </StatusCard>
    );
  }
  const warn = (text: string) => (
    <View style={{ flexDirection: "row", gap: space.sm, padding: space.smPlus, borderRadius: radius.sm, backgroundColor: c.warnBg }}>
      <Text style={{ ...typography.label, color: c.warn }}>⚠</Text>
      <Text style={{ ...typography.label, color: c.warn, flex: 1 }}>{text}</Text>
    </View>
  );

  return (
    <View style={{ gap: space.md }}>
      {isMock && warn(t("common.mockNotice"))}
      {known && !r.confident && warn(`${t("result.lowConfidence.title")} ${t("result.lowConfidence.body")}`)}
      <View style={{ gap: space.smPlus, padding: space.page, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, backgroundColor: c.surface }}>
        {r.category && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, padding: space.md, borderRadius: radius.sm, backgroundColor: cat.bg }}>
            <CategoryIcon category={r.category} size={sizes.iconDefault} color={cat.text} />
            <Text style={{ ...typography.label, color: cat.text }}>{r.category}</Text>
          </View>
        )}
        {known && !r.confident && <Text style={{ ...typography.eyebrow, color: c.warn }}>{t("result.lowConfidence.badge")}</Text>}
        {r.item_name && <Text accessibilityRole="header" style={{ ...typography.resultTitle, color: c.text }}>{r.item_name}</Text>}
        <Text style={{ ...typography.body, color: c.text }}>{r.answer}</Text>

        {r.steps.length > 0 && (
          <View accessibilityRole="list">
            {r.steps.map((s, i) => (
              <Animated.View key={i} entering={FadeInDown.delay(Math.min(i, 3) * motion.cardStaggerMs).duration(motion.cardEnterMs)}
                style={{ minHeight: sizes.buttonMinHeight, flexDirection: "row", alignItems: "center", gap: space.smPlus, paddingVertical: space.smPlus, borderTopWidth: i ? 1 : 0, borderColor: c.divider }}>
                <View style={{ width: sizes.stepBadge, height: sizes.stepBadge, borderRadius: radius.pill, backgroundColor: c.tint, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ ...typography.label, color: c.primary }}>{i + 1}</Text>
                </View>
                <Text style={{ ...typography.body, color: c.text, flex: 1 }}>{s}</Text>
              </Animated.View>
            ))}
          </View>
        )}

        {known && (
          <View style={{ gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: c.tint }}>
            <Text style={{ ...typography.caption, color: c.subtext }}>{r.confident ? t("result.nextDays.title") : t("result.lowConfidence.nextDaysNote")}</Text>
            <Text style={{ ...typography.section, color: c.text }}>{r.next_days.length ? r.next_days.map((d) => `${d}요일`).join(", ") : t("result.nextDays.unknown")}</Text>
            <Text style={{ ...typography.label, color: c.text }}>{r.time ?? t("home.today.timeUnknown")}</Text>
            {r.note && <Text style={{ ...typography.caption, color: c.subtext }}>{r.note}</Text>}
          </View>
        )}

        <SourceDisclosure sources={r.sources} label={t("result.sources.toggle")} />
        {r.follow_up && <Button variant="secondary" label={t("result.followUp.open")} onPress={() => { setErr(false); setOpen(true); }} />}
      </View>

      {!r.confident ? (
        <View style={{ gap: space.sm }}>
          <Button label={t("result.lowConfidence.retryPhoto")} onPress={() => (onRetake ? onRetake() : router.push("/capture"))} />
          <Button variant="secondary" label={t("result.lowConfidence.askText")} onPress={() => router.push("/ask")} />
        </View>
      ) : (
        <View style={{ gap: space.sm }}>
          <Button variant="secondary" label={t("result.lowConfidence.retryPhoto")} onPress={() => (onRetake ? onRetake() : router.push("/capture"))} />
          <Button variant="secondary" label={t("result.lowConfidence.askText")} onPress={() => router.push("/ask")} />
        </View>
      )}

      <Sheet visible={open && !!r.follow_up} onClose={() => setOpen(false)}>
        {r.follow_up && (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <CategoryIcon category={r.category} size={sizes.iconLarge} color={c.primary} />
              <Text style={{ ...typography.bodyStrong, color: c.text, flex: 1 }}>{r.item_name}</Text>
            </View>
            <Text style={{ ...typography.caption, color: c.subtext }}>{t("result.followUp.sheetTitle")}</Text>
            <Text accessibilityRole="header" style={{ ...typography.resultTitle, color: c.text }}>{r.follow_up.question}</Text>
            {busy !== null && <Text accessibilityLiveRegion="polite" style={{ ...typography.body, color: c.subtext }}>{t("result.followUp.loading")}</Text>}
            {err && (
              <View accessibilityRole="alert" style={{ padding: space.md, borderRadius: radius.sm, backgroundColor: c.errorBg }}>
                <Text style={{ ...typography.body, color: c.error }}>{t("result.followUp.error")}</Text>
              </View>
            )}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.smPlus }}>
              {[true, false].map((yes) => (
                <View key={String(yes)} style={{ flexGrow: 1, flexBasis: 140 }}>
                  <Button label={t(yes ? "result.followUp.yes" : "result.followUp.no")} busy={busy === yes} disabled={busy !== null && busy !== yes}
                    variant={yes ? "primary" : "secondary"} haptic={false} onPress={() => answer(yes)} />
                </View>
              ))}
            </View>
          </>
        )}
      </Sheet>
    </View>
  );
}
