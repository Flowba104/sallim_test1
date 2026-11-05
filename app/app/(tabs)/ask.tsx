import { useState } from "react";
import { ScrollView, Text, TextInput } from "react-native";
import ResultCard from "../../components/ResultCard";
import { Btn, ErrorBox, Loading } from "../../components/Status";
import { ask } from "../../lib/api";
import type { AskResponse } from "../../lib/api-types";
import { useRegion } from "../../lib/useRegion";
import { colors, radius, sizes, space } from "../../theme";

export default function Ask() {
  const regionId = useRegion();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [n, setN] = useState(0); // 새 질문마다 ResultCard 리마운트(누적 답 초기화)

  async function submit() {
    if (!regionId || !q.trim()) return;
    setErr(null);
    setBusy(true);
    try {
      setResult(await ask({ region_id: regionId, question: q.trim() }));
      setN((x) => x + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "오류가 났어요");
    } finally {
      setBusy(false);
    }
  }

  const noRegion = !regionId;
  return (
    <ScrollView contentContainerStyle={{ padding: space.md, gap: space.md }} style={{ backgroundColor: colors.bg }}
      keyboardShouldPersistTaps="handled">
      {regionId === null && <Text style={{ color: colors.warn }}>설정에서 동네를 먼저 골라 주세요.</Text>}
      <TextInput value={q} onChangeText={setQ} placeholder="예: 투명 페트병은 어떻게 버려요?" onSubmitEditing={submit}
        editable={!noRegion}
        style={{ minHeight: sizes.inputMinHeight, padding: space.md, borderWidth: 1, borderColor: colors.border,
          borderRadius: radius.button, backgroundColor: noRegion ? colors.disabledBg : colors.surface }} />
      <Btn label="물어보기" onPress={submit} disabled={busy || noRegion} />
      {busy && <Loading />}
      {err && <ErrorBox message={err} onRetry={submit} />}
      {result && regionId && <ResultCard key={n} result={result} regionId={regionId} onChange={setResult} />}
    </ScrollView>
  );
}
