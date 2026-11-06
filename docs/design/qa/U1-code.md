# D4-U1 · 공통 컴포넌트 코드 QA

**최종 확인: 아래 지적 1~5가 모두 반영됐다. Sheet 스크롤/안전영역·100ms 눌림·Chip48, 웹 선택/펼침 상태, 탭70·라벨12/18을 확인했다. 아래 초기 항목은 이력이며 미해결 지적이 아니다.**

2026-11-06 · U11 완료 전 읽기 기준. `app/` 수정 없음. [U1 기준](../components.md). 실제 웹/기기 동작은 별도 캡처에서 재확인한다.

1. **[우선] 전체목록·되묻기 / Sheet 내용 및 닫기** — 현재 `app/components/Sheet.tsx`의 maxHeight85% 컨테이너에 children을 일반 View로 넣는다. 홈 목록12개면 행576+간격+제목+닫기가717px 가용높이를 넘고, 긴 질문/큰글자에서도 하단행이 잘릴 수 있다. 기대: `components.sheet.maxHeightFraction`0.85 내에 ScrollView 본문, 항상 접근할 수 있는 닫기48(`sizes.touchMin`), 실제 bottom inset+`space.page` 여백. 고정 paddingBottom32만으로 safe area를 대체하지 않는다.
2. **전체 화면 / Button·Chip 눌림** — 현재 Pressable의 scale0.98이 즉시 적용되고 Button secondary pressed는 `colors.tint`다. 기대: `motion.pressMs`100 + `motion.easing.standard`, `motion.pressScale`0.98, secondary는 `colors.surfacePressed`, reduced motion에서는 scale0ms·고정1. Reanimated 전역 ReducedMotionConfig만으로 Pressable style의 scale은 꺼지지 않는다.
3. **요일·추천 / Chip 크기·선택형태** — 현재 `sizes.touchAbsoluteMin`44와 selected border1/합성 fontWeight를 사용한다. 기대: U1 `components.chip.minHeight`48, selected `border.selected`2, 대응 Pretendard family로 굵기. 요일의 부모폭과 오늘 문구 줄바꿈은 U3 시각 QA에서 별도 확인한다.

라이트/다크 기본색은 tokens v2에 동기화돼 있고, 카테고리 그룹색 및 출처 자료기준은 읽기상 확인했다. 이 기록은 U1 완전통과 판정이 아니다.

## 최종 export 추가 확인

4. **[접근성] 출처·선택 컴포넌트 / expanded·selected 상태** — 웹에 설치된 `react-native-web/dist/modules/createDOMProps/index.js`는 aria-expanded/aria-selected/aria-checked 또는 개별 accessibilityExpanded/Selected/Checked를 읽고 `accessibilityState` 묶음을 처리하지 않는다. 현재 SourceDisclosure와 Chip는 묶음만 전달해 웹에서 펼침·선택상태가 누락될 수 있다. 기대: 출처에 expanded true/false, 선택Chip에 selected/pressed, 지역·테마radio에 checked를 native·web 모두 노출. 색은 `colors.primary/tint`·기존 토큰 유지. 실제 radio 트리에서 checked 누락은 U2/U9 캡처 probe로 확인했다.
5. **전체 탭 화면 / BottomTabs** — 현재 탭은 라이브러리 기본높이48px로 측정되며 label도 기본스타일이다. 기대: `sizes.tabBarMinHeight`70+실제 bottom inset, `typography.navigation`12/18과 Pretendard-SemiBold, icon24. 터치 절대하한44는 만족하므로 주요정보 오류보다 낮은 우선순위지만 U1 명세·토큰 기준에 맞춘다.

기존1~3 지적은 최신 코드에 ScrollView+insets/100ms press hook/reduced-motion/Chip48·선택선2로 반영됐다. Sheet12품목/320긴질문 닫기는 실제캡처로 확인했다. native TalkBack과 햅틱은 미검증.

## 최종 수치·상태 검증

양테마 탭바70px, 각탭 터치61px, label12/18 Pretendard-SemiBold. region radio aria-checked=true, 테마선택radio [checked], 요일Chip aria-selected=true, 출처접기 aria-expanded=false→true 모두 assert 통과. 기존색·간격이 임의로 바뀌지 않았고 최종캡처는 U3-home-*-final.png와 U8-U9-theme-override-from-*-final.png.
