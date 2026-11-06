import AsyncStorage from "@react-native-async-storage/async-storage";

// 최근 확인한 물건 (최대 3개, 기기에만 저장). 지역이 다르면 홈에서 "이전 동네"로 표시한다.
export type Recent = { item_key: string; item_name: string; category: string | null; region_id: string; at: number };
const KEY = "recent_items";

export async function getRecent(): Promise<Recent[]> {
  try { return JSON.parse((await AsyncStorage.getItem(KEY)) ?? "[]"); } catch { return []; }
}

export async function addRecent(r: Omit<Recent, "at">) {
  try {
    const rest = (await getRecent()).filter((x) => !(x.item_key === r.item_key && x.region_id === r.region_id));
    await AsyncStorage.setItem(KEY, JSON.stringify([{ ...r, at: Date.now() }, ...rest].slice(0, 3)));
  } catch { /* 저장 실패는 기능에 영향 없음 */ }
}
