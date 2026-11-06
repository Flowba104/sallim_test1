import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import type { Source } from "../lib/api-types";
import { sizes, space, typography, useColors } from "../theme";

// 출처 접기/펼치기. 자료가 없으면 확인 필요 문구.
export default function SourceDisclosure({ sources, label = "출처 확인하기" }: { sources: Source[]; label?: string }) {
  const c = useColors();
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen((o) => !o)}
        style={{ minHeight: sizes.touchMin, flexDirection: "row", alignItems: "center", gap: space.sm }}>
        <Text style={{ ...typography.label, color: c.subtext }}>{open ? "▾" : "▸"} {label}</Text>
      </Pressable>
      {open && (sources.length === 0
        ? <Text style={{ ...typography.caption, color: c.subtext }}>출처 정보를 확인할 수 없어요. 동네 안내를 직접 확인해 주세요.</Text>
        : sources.map((x) => (
          <Pressable key={x.url} accessibilityRole="link" accessibilityLabel={`출처 ${x.title}`} onPress={() => Linking.openURL(x.url).catch(() => {})}
            style={{ minHeight: sizes.touchMin, justifyContent: "center" }}>
            <Text style={{ ...typography.caption, color: c.subtext, textDecorationLine: "underline" }}>{x.title}</Text>
            <Text style={{ ...typography.caption, color: c.subtext }}>자료 기준 {x.updated}</Text>
          </Pressable>
        )))}
    </View>
  );
}
