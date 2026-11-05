import { useState } from "react";
import { ScrollView, Text } from "react-native";
import ResultCard from "../../components/ResultCard";
import { Btn, ErrorBox, Loading } from "../../components/Status";
import { ask } from "../../lib/api";
import type { AskResponse } from "../../lib/api-types";
import { pickImageBase64 } from "../../lib/image";
import { useRegion } from "../../lib/useRegion";
import { colors, space } from "../../theme";

export default function Capture() {
  const regionId = useRegion();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [b64, setB64] = useState<string | null>(null); // 마지막 사진 — 다시 시도용
  const [n, setN] = useState(0); // 새 질문마다 ResultCard 리마운트(누적 답 초기화)

  async function send(img: string) {
    if (!regionId) return;
    setErr(null);
    setBusy(true);
    try {
      setResult(await ask({ region_id: regionId, image_base64: img }));
      setN((x) => x + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "오류가 났어요");
    } finally {
      setBusy(false);
    }
  }

  async function go(source: "camera" | "library") {
    setErr(null);
    setBusy(true);
    try {
      const img = await pickImageBase64(source);
      if (img) { setB64(img); await send(img); }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "오류가 났어요");
    } finally {
      setBusy(false);
    }
  }

  const noRegion = !regionId;
  return (
    <ScrollView contentContainerStyle={{ padding: space.md, gap: space.md }} style={{ backgroundColor: colors.bg }}>
      {regionId === null && <Text style={{ color: colors.warn }}>설정에서 동네를 먼저 골라 주세요.</Text>}
      <Btn label="사진 찍기" onPress={() => go("camera")} disabled={busy || noRegion} />
      <Btn label="앨범에서 고르기" onPress={() => go("library")} disabled={busy || noRegion} />
      {busy && <Loading />}
      {err && <ErrorBox message={err} onRetry={b64 ? () => send(b64) : undefined} />}
      {result && regionId && <ResultCard key={n} result={result} regionId={regionId} onChange={setResult} />}
    </ScrollView>
  );
}
