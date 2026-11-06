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
  "onCamera": "#FFFFFF",
  "surfacePressed": "#F0F1E7",
  "surfaceRaised": "#FFFFFF",
  "placeholder": "#536157",
  "skeleton": "#D6DACA",
  "skeletonHighlight": "#ECEEE3",
  "overlay": "#13241CCC",
  "transparent": "#00000000"
} as const;

// 원본: docs/design/tokens.json v2 themes.dark — 값 복사본
export const darkColors: Record<keyof typeof lightColors, string> = {
  "bg": "#15231C",
  "surface": "#1F3027",
  "text": "#F3F4E9",
  "subtext": "#BECBBC",
  "primary": "#ACD1B2",
  "onPrimary": "#183323",
  "primaryPressed": "#91BC99",
  "tint": "#304838",
  "accent": "#E6B493",
  "onAccent": "#24372B",
  "border": "#829383",
  "divider": "#405548",
  "warn": "#F3D495",
  "warnBg": "#42351F",
  "error": "#FFBAB0",
  "errorBg": "#482C2A",
  "success": "#ACD1B2",
  "focus": "#C9E4BC",
  "disabledBg": "#35443A",
  "disabledText": "#BECBBC",
  "cameraBg": "#102018",
  "onCamera": "#FFFFFF",
  "surfacePressed": "#2C4235",
  "surfaceRaised": "#293E31",
  "placeholder": "#BECBBC",
  "skeleton": "#405548",
  "skeletonHighlight": "#536B59",
  "overlay": "#000000CC",
  "transparent": "#00000000"
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
  "chipGap": 6,
  "chipX": 10,
  "chipY": 5,
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

export const motion = {"pressMs": 100, "screenMs": 200, "loadingOrbitMs": 1400, "reducedMotionMs": 0, "sheetEnterMs": 280, "sheetExitMs": 200, "cardEnterMs": 260, "cardStaggerMs": 40, "skeletonMs": 1200, "scanMs": 1600, "themeMs": 180, "toastEnterMs": 180, "toastVisibleMs": 4000, "pressScale": 0.98, "cardOffsetY": 16, "sheetOffsetY": 32, "easing": {"standard": [0.2, 0, 0, 1], "enter": [0.16, 1, 0.3, 1], "exit": [0.4, 0, 1, 1], "linear": [0, 0, 1, 1]}} as const;
