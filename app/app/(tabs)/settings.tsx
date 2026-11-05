import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Btn, ErrorBox, Loading } from "../../components/Status";
import { getRegions } from "../../lib/api";
import type { Region } from "../../lib/api-types";
import { setRegionId } from "../../lib/region";
import { useRegion } from "../../lib/useRegion";
import { colors, radius, sizes, space, typography } from "../../theme";

export default function Settings() {
  const saved = useRegion();
  const [sel, setSel] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    setErr(null);
    setRegions(null);
    getRegions().then(setRegions).catch((e) => setErr(String(e.message ?? e)));
  }, []);
  useEffect(load, [load]);
  const current = sel ?? saved;

  return (
    <ScrollView contentContainerStyle={{ padding: space.md, gap: space.sm }} style={{ backgroundColor: colors.bg }}>
      <Text style={{ ...typography.section, color: colors.text }}>우리 동네 선택</Text>
      {!regions && !err && <Loading />}
      {err && <ErrorBox message={err} onRetry={load} />}
      {regions?.length === 0 && (
        <>
          <Text style={{ color: colors.subtext }}>지원하는 동네가 아직 없어요. 동네를 고를 때까지 찍기·물어보기는 쓸 수 없어요.</Text>
          <Btn label="다시 불러오기" onPress={load} />
        </>
      )}
      {regions?.map((r) => (
        <TouchableOpacity key={r.id} accessibilityRole="button" onPress={() => { setSel(r.id); setRegionId(r.id); }}
          style={{ minHeight: sizes.touchMin, justifyContent: "center", padding: space.md, borderWidth: 1,
            borderRadius: radius.button, backgroundColor: colors.surface,
            borderColor: current === r.id ? colors.primary : colors.border }}>
          <Text style={{ color: colors.text }}>{r.name}{current === r.id ? " ✓" : ""}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
