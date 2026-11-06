import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import RegionPicker from "../components/RegionPicker";
import { sizes, space, typography, useColors } from "../theme";
import { t } from "../lib/copy";

export default function RegionScreen() {
  const c = useColors();
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center", gap: space.sm, paddingHorizontal: space.page }}>
        {router.canGoBack() && (
          <Pressable accessibilityRole="button" accessibilityLabel="뒤로" onPress={() => router.back()}
            style={{ minHeight: sizes.touchMin, minWidth: sizes.touchMin, justifyContent: "center" }}>
            <Text style={{ ...typography.section, color: c.text }}>←</Text>
          </Pressable>
        )}
        <Text accessibilityRole="header" style={{ ...typography.section, color: c.text }}>{t("region.header")}</Text>
      </View>
      <RegionPicker onDone={() => router.replace("/")} />
    </SafeAreaView>
  );
}
