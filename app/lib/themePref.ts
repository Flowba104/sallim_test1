import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export type ThemePref = "system" | "light" | "dark";
const KEY = "theme_pref";

// Appearance.setColorScheme을 쓰면 useColorScheme()을 쓰는 모든 화면이 같이 바뀐다(구조·스크롤·입력 유지).
export function applyThemePref(p: ThemePref) {
  Appearance.setColorScheme(p === "system" ? "unspecified" : p);
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
