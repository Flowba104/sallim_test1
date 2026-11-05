import { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { followUp, isMock } from "../lib/api";
import type { AskResponse, ItemState } from "../lib/api-types";
import CategoryIcon from "./CategoryIcon";
import { Btn } from "./Status";
import { colors, radius, sizes, space, typography } from "../theme";

// 받침 있으면 "으로", 없거나 ㄹ받침이면 "로"
function josa(w: string) {
  const c = w.charCodeAt(w.length - 1) - 0xac00;
  return c < 0 || c > 11171 || c % 28 === 0 || c % 28 === 8 ? "로" : "으로";
}

type Props = { result: AskResponse; regionId: string; onChange: (r: AskResponse) => void };

export default function ResultCard({ result: r, regionId, onChange }: Props) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  // 지금까지의 되묻기 답 누적 (새 /ask 결과는 부모가 key로 리마운트해 초기화)
  const [state, setState] = useState<ItemState>({});

  async function answer(yes: boolean) {
    if (!r.item_key || !r.follow_up) return;
    setErr(null);
    const next = { ...state, [r.follow_up.key]: yes };
    try {
      onChange(await followUp({ region_id: regionId, item_key: r.item_key, state: next }));
      setState(next);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "오류가 났어요");
    }
  }

  return (
    <View style={{ gap: space.sm, padding: space.md, borderWidth: 1, borderColor: colors.divider, borderRadius: radius.md, backgroundColor: colors.surface }}>
      {isMock && <Text style={{ color: colors.error }}>예시 데이터예요 — 실제 배출 안내가 아니에요</Text>}
      {!r.item_key && <Text style={{ ...typography.section, color: colors.text }}>이 물건은 아직 찾지 못했어요.</Text>}
      {!r.confident && (
        <View style={{ gap: space.sm, padding: space.md, borderRadius: radius.sm, backgroundColor: colors.warnBg }}>
          <Text style={{ color: colors.warn, fontWeight: "700" }}>확신이 낮은 결과예요</Text>
          <Btn label="다시 찍기" onPress={() => router.push("/capture")} />
          <Btn label="이름으로 물어보기" onPress={() => router.push("/ask")} />
        </View>
      )}
      {r.item_name && <Text style={{ fontSize: typography.resultTitle.fontSize, fontWeight: typography.resultTitle.fontWeight, color: colors.text }}>{r.confident ? r.item_name : `${r.item_name}${josa(r.item_name)} 보여요`}</Text>}
      {r.category && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
          <CategoryIcon category={r.category} />
          <Text style={{ color: colors.primary }}>{r.category}</Text>
        </View>
      )}
      <Text style={{ color: colors.text }}>{r.answer}</Text>
      {r.steps.map((s, i) => (
        <Text key={i} style={{ color: colors.text }}>{i + 1}. {s}</Text>
      ))}
      {r.item_key && (
        <Text style={{ color: colors.subtext }}>
          {r.next_days.length ? `배출 요일: ${r.next_days.join(", ")}` : "배출 요일 확인 필요"}
          {" · "}
          {r.time ? r.time : "배출 시간 확인 필요"}
        </Text>
      )}
      {r.note && <Text style={{ color: colors.subtext, ...typography.caption }}>{r.note}</Text>}
      {r.follow_up && (
        <View style={{ gap: space.sm }}>
          <Text style={{ color: colors.text }}>{r.follow_up.question}</Text>
          <View style={{ flexDirection: "row", gap: space.sm }}>
            {[true, false].map((yes) => (
              <TouchableOpacity key={String(yes)} onPress={() => answer(yes)} accessibilityRole="button"
                style={{ minHeight: sizes.touchMin, justifyContent: "center", padding: space.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.button }}>
                <Text style={{ color: colors.text }}>{yes ? "예" : "아니오"}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {err && <Text style={{ color: colors.error }}>{err}</Text>}
      {r.sources.map((s) => (
        <Text key={s.url} style={{ color: colors.subtext, ...typography.caption }} onPress={() => Linking.openURL(s.url)}>
          출처: {s.title} · 자료 기준 {s.updated}
        </Text>
      ))}
    </View>
  );
}
