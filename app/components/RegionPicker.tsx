import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Button from "./Button";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";
import { getRegions } from "../lib/api";
import type { Region } from "../lib/api-types";
import { getRegionId, setOnboarded, setRegionId } from "../lib/region";
import { t } from "../lib/copy";
import { radius, sizes, space, typography, useColors } from "../theme";

// 동네 선택 + 저장. 온보딩 마지막과 설정에서 같이 쓴다. 저장 성공 시에만 onDone.
export default function RegionPicker({ onDone }: { onDone: () => void }) {
  const c = useColors();
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [saveErr, setSaveErr] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoadErr(false);
    setRegions(null);
    getRegions().then(setRegions).catch(() => setLoadErr(true));
  }, []);
  useEffect(load, [load]);
  useEffect(() => { getRegionId().then((id) => id && setSel((s) => s ?? id)); }, []);

  async function save() {
    if (!sel) return;
    setSaving(true);
    setSaveErr(false);
    try {
      await setRegionId(sel);
      await setOnboarded();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onDone();
    } catch {
      setSaveErr(true);
    } finally {
      setSaving(false);
    }
  }

  // 저장된 동네가 목록에서 사라졌으면 선택 해제
  const valid = !!regions?.some((r) => r.id === sel);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: space.page, gap: space.md }}>
        <Text accessibilityRole="header" style={{ ...typography.resultTitle, color: c.text }}>{t("region.title")}</Text>
        <Text style={{ ...typography.body, color: c.subtext }}>{t("region.description")}</Text>

        {!regions && !loadErr && (
          <View accessible accessibilityLabel={t("region.loading")} style={{ gap: space.smPlus }}>
            <Skeleton height={sizes.buttonMinHeight + space.lg} />
            <Skeleton height={sizes.buttonMinHeight + space.lg} />
            <Text style={{ ...typography.caption, color: c.subtext }}>{t("region.loading")}</Text>
          </View>
        )}
        {loadErr && (
          <View accessibilityRole="alert" style={{ gap: space.smPlus, padding: space.md, borderRadius: radius.md, backgroundColor: c.errorBg }}>
            <Text style={{ ...typography.bodyStrong, color: c.error }}>{t("region.error")}</Text>
            <Button label={t("region.retry")} onPress={load} haptic={false} />
          </View>
        )}
        {regions?.length === 0 && <EmptyState title={t("region.empty")} actionLabel={t("region.retry")} onAction={load} />}
        {regions?.map((r) => {
          const on = r.id === sel;
          return (
            <Pressable key={r.id} accessibilityRole="radio" accessibilityLabel={r.name} accessibilityState={{ selected: on }}
              onPress={() => { setSel(r.id); setSaveErr(false); Haptics.selectionAsync().catch(() => {}); }}
              style={({ pressed }) => ({ minHeight: 80, justifyContent: "center", padding: space.md, gap: space.xs, borderRadius: radius.md,
                borderWidth: on ? 2 : 1, borderColor: on ? c.primary : c.border,
                backgroundColor: on ? c.tint : pressed ? c.surfacePressed : c.surface })}>
              <Text style={{ ...typography.bodyStrong, color: c.text }}>{r.name}</Text>
              {on && <Text style={{ ...typography.label, color: c.primary }}>✓ {t("region.selected")}</Text>}
            </Pressable>
          );
        })}
        <Text style={{ ...typography.caption, color: c.subtext }}>{t("region.help")}</Text>
      </ScrollView>
      <View style={{ padding: space.page, gap: space.sm }}>
        {saveErr && <Text accessibilityRole="alert" style={{ ...typography.caption, color: c.error }}>{t("region.saveError")}</Text>}
        {!valid && !loadErr && <Text style={{ ...typography.caption, color: c.subtext }}>{t("region.pick")}</Text>}
        <Button label={t("region.confirm")} onPress={save} disabled={!valid} busy={saving} />
      </View>
    </View>
  );
}
