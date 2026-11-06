import { useColorScheme } from "react-native";
// 원본: docs/design/tokens.json v1.0.0-draft (A 살림 노트, 추천안·오너 선택 전). 값 복사본 — 토큰이 바뀌면 같이 갱신.
export const lightColors = {
  "bg": "#F7F3E8",
  "surface": "#FFFEF9",
  "text": "#253D32",
  "subtext": "#536157",
  "primary": "#2E5943",
  "onPrimary": "#FFFFFF",
  "primaryPressed": "#244634",
  "tint": "#E8ECDC",
  "accent": "#F1C3A2",
  "onAccent": "#253D32",
  "border": "#829080",
  "divider": "#D6DACA",
  "warn": "#624619",
  "warnBg": "#FFF0D2",
  "error": "#A3342F",
  "errorBg": "#FBE9E5",
  "success": "#2E5943",
  "focus": "#2E5943",
  "disabledBg": "#E0E3D9",
  "disabledText": "#536157",
  "cameraBg": "#29382F",
  "onCamera": "#FFFFFF"
} as const;

// 다크 팔레트 — designer D1 확정 전 임시값(본문/배경 대비 4.5:1 이상). 확정되면 교체.
export const darkColors: Record<keyof typeof lightColors, string> = {
  bg: "#16211B", surface: "#1F2D25", text: "#EEF1E6", subtext: "#B4BFB3",
  primary: "#8FCDA8", onPrimary: "#0F1F16", primaryPressed: "#A9DDBF",
  tint: "#2A3C31", accent: "#F1C3A2", onAccent: "#253D32", border: "#7C8C7E", divider: "#34463A",
  warn: "#F3D79B", warnBg: "#3B3014", error: "#F2A9A3", errorBg: "#3E1D1B",
  success: "#8FCDA8", focus: "#8FCDA8", disabledBg: "#2A3A30", disabledText: "#B4BFB3",
  cameraBg: "#0F1713", onCamera: "#FFFFFF",
};

// 정적 import 호환용(라이트). 다크 대응이 필요한 화면은 useColors() 사용.
export const colors = lightColors;

export function useColors(): Record<keyof typeof lightColors, string> {
  return useColorScheme() === "dark" ? darkColors : lightColors;
}

export const space = {
  "none": 0,
  "xs": 4,
  "sm": 8,
  "smPlus": 12,
  "md": 16,
  "page": 20,
  "lg": 24,
  "xl": 32,
  "xxl": 40,
  "section": 48
} as const;

export const radius = {
  "none": 0,
  "xs": 4,
  "sm": 8,
  "button": 14,
  "md": 20,
  "lg": 28,
  "pill": 999
} as const;

export const typography = {
  "display": {
    "fontSize": 48,
    "lineHeight": 56,
    "fontWeight": "700",
    "letterSpacing": -1.6
  },
  "heading": {
    "fontSize": 32,
    "lineHeight": 40,
    "fontWeight": "700",
    "letterSpacing": -1
  },
  "resultTitle": {
    "fontSize": 28,
    "lineHeight": 36,
    "fontWeight": "700",
    "letterSpacing": -0.7
  },
  "section": {
    "fontSize": 18,
    "lineHeight": 26,
    "fontWeight": "600",
    "letterSpacing": -0.2
  },
  "body": {
    "fontSize": 16,
    "lineHeight": 24,
    "fontWeight": "400",
    "letterSpacing": 0
  },
  "bodyStrong": {
    "fontSize": 16,
    "lineHeight": 24,
    "fontWeight": "600",
    "letterSpacing": 0
  },
  "button": {
    "fontSize": 16,
    "lineHeight": 24,
    "fontWeight": "600",
    "letterSpacing": 0
  },
  "label": {
    "fontSize": 14,
    "lineHeight": 20,
    "fontWeight": "500",
    "letterSpacing": 0
  },
  "caption": {
    "fontSize": 12,
    "lineHeight": 18,
    "fontWeight": "400",
    "letterSpacing": 0
  },
  "eyebrow": {
    "fontSize": 12,
    "lineHeight": 20,
    "fontWeight": "600",
    "letterSpacing": 0.5
  },
  "navigation": {
    "fontSize": 12,
    "lineHeight": 18,
    "fontWeight": "600",
    "letterSpacing": 0
  }
} as const;

export const sizes = {
  "touchMin": 48,
  "touchAbsoluteMin": 44,
  "buttonMinHeight": 52,
  "inputMinHeight": 52,
  "pageGutter": 20,
  "iconSmall": 20,
  "iconDefault": 24,
  "iconLarge": 32,
  "tabBarMinHeight": 70,
  "safeAreaPreviewTop": 30,
  "safeAreaPreviewBottom": 20,
  "artboardWidth": 390,
  "artboardHeight": 844
} as const;

export const shadow = {
  "none": {
    "shadowColor": "#253D32",
    "shadowOffset": {
      "width": 0,
      "height": 0
    },
    "shadowOpacity": 0,
    "shadowRadius": 0,
    "elevation": 0
  },
  "card": {
    "shadowColor": "#253D32",
    "shadowOffset": {
      "width": 0,
      "height": 2
    },
    "shadowOpacity": 0.06,
    "shadowRadius": 6,
    "elevation": 1
  },
  "overlay": {
    "shadowColor": "#253D32",
    "shadowOffset": {
      "width": 0,
      "height": 8
    },
    "shadowOpacity": 0.12,
    "shadowRadius": 16,
    "elevation": 4
  }
} as const;

export const motion = { pressMs: 100, screenMs: 200, loadingOrbitMs: 1400, toastMs: 2400 } as const;
