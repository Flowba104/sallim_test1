import { SvgXml } from "react-native-svg";
import { sizes, useColors } from "../theme";

// 상태 화면용 단순 아이콘 (직접 그린 24×24 stroke 2). 장식용 — 제목이 의미를 전달.
const BODY = {
  unknown: '<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01"/>',
  offline: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01M3 3l18 18"/>',
  error: '<circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 17h.01"/>',
  time: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
};
export type StateKind = keyof typeof BODY;

export default function StateIcon({ kind, color }: { kind: StateKind; color?: string }) {
  const c = useColors();
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color ?? c.text}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${BODY[kind]}</svg>`;
  return <SvgXml xml={xml} width={sizes.stateIcon} height={sizes.stateIcon} accessibilityElementsHidden importantForAccessibility="no" />;
}
