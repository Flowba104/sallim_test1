import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export type ThemePref = "system" | "light" | "dark";
const KEY = "theme_pref";

// 네이티브는 Appearance.setColorScheme도 같이 호출(상태바·시스템 UI 일치). 화면 색은 theme.ts useScheme()이 current를 읽는다.
// 앱 안 선택값 저장소 — 웹에는 Appearance.setColorScheme이 없어 useScheme()(theme.ts)이 이 값을 직접 읽는다.
let current: ThemePref = "system";
const listeners = new Set<() => void>();
export const getThemePref = () => current;
export const subscribeThemePref = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

export function applyThemePref(p: ThemePref) {
  current = p;
  listeners.forEach((l) => l());
  try { Appearance.setColorScheme(p === "system" ? "unspecified" : p); } catch { /* 웹 등 미지원 환경은 시스템 설정을 따른다 */ }
}

export async function loadThemePref(): Promise<ThemePref> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch { return "system"; }
}

// 저장 실패 시 throw — 호출한 화면이 기존 테마를 유지하고 오류를 보여 준다. 저장 성공 후에만 적용.
export async function saveThemePref(p: ThemePref) {
  await AsyncStorage.setItem(KEY, p);
  applyThemePref(p);
}
