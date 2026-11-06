import { ColorValue } from "react-native";
import { SvgXml } from "react-native-svg";
import { sizes } from "../theme";

// 탭 아이콘 (직접 그린 24×24 stroke 2). 장식용 — 탭 라벨이 의미 전달.
const BODY = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
  capture: '<path d="M4 8h3l2-3h6l2 3h3v12H4Z"/><circle cx="12" cy="13" r="3.5"/>',
  ask: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  settings: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
};

export default function TabIcon({ name, color }: { name: keyof typeof BODY; color: ColorValue }) {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${String(color)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${BODY[name]}</svg>`;
  return <SvgXml xml={xml} width={sizes.iconDefault} height={sizes.iconDefault} accessibilityElementsHidden importantForAccessibility="no" />;
}
