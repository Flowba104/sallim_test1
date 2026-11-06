import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInRight, FadeInLeft } from "react-native-reanimated";
import Button from "../components/Button";
import CategoryIcon from "../components/CategoryIcon";
import { motion, radius, sizes, space, typography, useColors } from "../theme";
import { t } from "../lib/copy";

// D3 일러스트(app/assets/brand/onboarding-*.svg)가 오기 전까지 tint 면 + 카테고리 아이콘
const PAGES = [
  { key: "photo", icon: "투명페트" },
  { key: "method", icon: "종이" },
  { key: "region", icon: "일반쓰레기" },
];

export default function Onboarding() {
  const c = useColors();
  const router = useRouter();
  const [i, setI] = useState(0);
  const [back, setBack] = useState(false);
  const p = PAGES[i];
  const last = i === PAGES.length - 1;
  const go = (n: number) => { setBack(n < i); setI(n); };
  const enter = (back ? FadeInLeft : FadeInRight).duration(motion.screenMs);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.page }}>
        <Text style={{ ...typography.section, color: c.primary }}>SaLLiM</Text>
        <Pressable accessibilityRole="button" onPress={() => router.replace("/region")}
          style={{ minHeight: sizes.touchMin, minWidth: sizes.touchMin, justifyContent: "center", alignItems: "flex-end" }}>
          <Text style={{ ...typography.label, color: c.subtext }}>{t("common.skip")}</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: space.page, paddingTop: space.xl, gap: space.md }}>
        <Animated.View key={i} entering={enter} style={{ gap: space.md }}>
          <View style={{ height: 240, borderRadius: radius.lg, backgroundColor: c.tint, alignItems: "center", justifyContent: "center" }}>
            <CategoryIcon category={p.icon} size={96} color={c.primary} />
          </View>
          <Text accessibilityRole="header" style={{ ...typography.heading, color: c.text, marginTop: space.md }}>{t(`onboarding.${p.key}.title`)}</Text>
          <Text style={{ ...typography.body, color: c.subtext }}>{t(`onboarding.${p.key}.body`)}</Text>
        </Animated.View>
      </ScrollView>
      <View style={{ padding: space.page, gap: space.smPlus }}>
        <View accessible accessibilityLabel={`${PAGES.length}장 중 ${i + 1}장`} style={{ flexDirection: "row", justifyContent: "center", gap: space.sm }}>
          {PAGES.map((_, n) => (
            <View key={n} style={{ width: space.smPlus, height: space.sm, borderRadius: radius.pill, backgroundColor: n === i ? c.primary : c.divider }} />
          ))}
        </View>
        <Button label={last ? t("onboarding.start") : t("common.next")} onPress={() => (last ? router.replace("/region") : go(i + 1))} />
        {i > 0 && <Button variant="secondary" haptic={false} label={t("common.prev")} onPress={() => go(i - 1)} />}
      </View>
    </SafeAreaView>
  );
}
