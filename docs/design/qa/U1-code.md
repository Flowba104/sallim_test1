# D4-U1 · 공통 컴포넌트 코드 QA

2026-11-06 · U11 완료 전 읽기 기준. `app/` 수정 없음. [U1 기준](../components.md). 실제 웹/기기 동작은 별도 캡처에서 재확인한다.

1. **[우선] 전체목록·되묻기 / Sheet 내용 및 닫기** — 현재 `app/components/Sheet.tsx`의 maxHeight85% 컨테이너에 children을 일반 View로 넣는다. 홈 목록12개면 행576+간격+제목+닫기가717px 가용높이를 넘고, 긴 질문/큰글자에서도 하단행이 잘릴 수 있다. 기대: `components.sheet.maxHeightFraction`0.85 내에 ScrollView 본문, 항상 접근할 수 있는 닫기48(`sizes.touchMin`), 실제 bottom inset+`space.page` 여백. 고정 paddingBottom32만으로 safe area를 대체하지 않는다.
2. **전체 화면 / Button·Chip 눌림** — 현재 Pressable의 scale0.98이 즉시 적용되고 Button secondary pressed는 `colors.tint`다. 기대: `motion.pressMs`100 + `motion.easing.standard`, `motion.pressScale`0.98, secondary는 `colors.surfacePressed`, reduced motion에서는 scale0ms·고정1. Reanimated 전역 ReducedMotionConfig만으로 Pressable style의 scale은 꺼지지 않는다.
3. **요일·추천 / Chip 크기·선택형태** — 현재 `sizes.touchAbsoluteMin`44와 selected border1/합성 fontWeight를 사용한다. 기대: U1 `components.chip.minHeight`48, selected `border.selected`2, 대응 Pretendard family로 굵기. 요일의 부모폭과 오늘 문구 줄바꿈은 U3 시각 QA에서 별도 확인한다.

라이트/다크 기본색은 tokens v2에 동기화돼 있고, 카테고리 그룹색 및 출처 자료기준은 읽기상 확인했다. 이 기록은 U1 완전통과 판정이 아니다.
