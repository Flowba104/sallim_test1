import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Skeleton from "../../components/Skeleton";
import { getRegions } from "../../lib/api";
import { t } from "../../lib/copy";
import { getRegionId } from "../../lib/region";
import { loadThemePref, saveThemePref, ThemePref } from "../../lib/themePref";
import { radius, sizes, space, typography, useColors } from "../../theme";

const THEMES: ThemePref[] = ["system", "light", "dark"];

export default function Settings() {
  const c = useColors();
  const router = useRouter();
  const [regionName, setRegionName] = useState<string | null | undefined>(undefined); // undefined=로딩, null=없음
  const [removed, setRemoved] = useState(false);
  const [theme, setTheme] = useState<ThemePref | null>(null);
  const [themeErr, setThemeErr] = useState(false);

  useEffect(() => { loadThemePref().then(setTheme); }, []);
  useFocusEffect(useCallback(() => {
    (async () => {
      const id = await getRegionId();
      if (!id) { setRegionName(null); setRemoved(false); return; }
      try {
        const found = (await getRegions()).find((r) => r.id === id);
        setRegionName(found?.name ?? null);
        setRemoved(!found);
      } catch {
        setRegionName(id); // 목록 조회 실패 시 저장된 값은 그대로 보여 줌
      }
    })();
  }, []));

  async function pick(p: ThemePref) {
    if (p === theme) return;
    const prev = theme;
    setTheme(p); setThemeErr(false);
    Haptics.selectionAsync().catch(() => {});
    try { await saveThemePref(p); } catch {
      setTheme(prev); setThemeErr(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  }

  const card = { gap: space.sm, padding: space.page, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, backgroundColor: c.surface } as const;
  const title = (k: string) => <Text accessibilityRole="header" style={{ ...typography.section, color: c.text }}>{t(k)}</Text>;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: space.page, gap: space.md }}>
        <Text accessibilityRole="header" style={{ ...typography.heading, color: c.text, marginBottom: space.sm }}>{t("settings.header")}</Text>

        <View style={card}>
          {title("settings.region.title")}
          <Text style={{ ...typography.label, color: c.subtext }}>{t("settings.region.current")}</Text>
          {regionName === undefined
            ? <Skeleton width={180} height={24} />
            : <Text style={{ ...typography.bodyStrong, color: c.text }}>{regionName ?? t("settings.region.none")}</Text>}
          {removed && <Text accessibilityRole="alert" style={{ ...typography.caption, color: c.error }}>{t("settings.region.removed")}</Text>}
          <View style={{ marginTop: space.sm }}>
            <Button variant="secondary" label={t("settings.region.change")} onPress={() => router.push("/region")} />
          </View>
        </View>

        <View style={card}>
          {title("settings.theme.title")}
          {THEMES.map((p) => {
            const on = theme === p;
            return (
              <Pressable key={p} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={t(`settings.theme.${p}`)} onPress={() => pick(p)}
                style={({ pressed }) => ({ minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.md,
                  borderRadius: radius.button, borderWidth: on ? 2 : 1, borderColor: on ? c.primary : c.border,
                  backgroundColor: on ? c.tint : pressed ? c.surfacePressed : c.surface })}>
                <Text style={{ ...typography.body, color: c.text }}>{t(`settings.theme.${p}`)}</Text>
                {on && <Text style={{ ...typography.section, color: c.primary }}>✓</Text>}
              </Pressable>
            );
          })}
          {themeErr && <Text accessibilityRole="alert" style={{ ...typography.caption, color: c.error }}>{t("settings.theme.saveError")}</Text>}
        </View>

        <View style={card}>
          {title("settings.sources.title")}
          <Text style={{ ...typography.body, color: c.text }}>{t("settings.sources.body")}</Text>
        </View>

        <View style={card}>
          {title("settings.disclaimer.title")}
          <Text style={{ ...typography.body, color: c.subtext }}>{t("settings.disclaimer.body")}</Text>
        </View>

        <View style={card}>
          {title("settings.privacy.title")}
          <Text style={{ ...typography.body, color: c.subtext }}>{t("settings.privacy.body")}</Text>
        </View>

        <View style={{ ...card, flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: sizes.touchMin }}>
          <Text style={{ ...typography.body, color: c.text }}>{t("settings.version.title")}</Text>
          <Text style={{ ...typography.label, color: c.subtext }}>{Constants.expoConfig?.version ?? "-"}</Text>
        </View>

        <View style={card}>
          {title("settings.contact.title")}
          <Text style={{ ...typography.body, color: c.subtext }}>{t("settings.contact.body")}</Text>
          <Text style={{ ...typography.caption, color: c.subtext }}>{t("settings.contact.pending")}</Text>
        </View>

        <Text style={{ ...typography.caption, color: c.subtext, textAlign: "center", marginTop: space.lg, marginBottom: space.md }}>{t("settings.tagline")}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
