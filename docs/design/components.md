# SaLLiM 컴포넌트 명세 · U1 / A 살림 노트

2026-11-06 · MISSION v2 및 lead MSG-0003 확정. 기준: [tokens.json](tokens.json) v2.0.0, [방향 원형](drafts/warm-note/index.html), `shared/api-types.ts`. 이전 HTML은 시각 원형이며 이 문서와 화면별 `specs/U<n>.md`가 구현 기준이다. 앱 구현은 coder 소유다.

## 토큰 계약

- `primitives` → `themes[mode].colors`·`space`·`radius`·`typography` → `componentAliases` 순서로 사용한다. `colors`는 라이트 호환값이고 `components`의 raw 색도 라이트 참고값이다. 다크는 의미 토큰을 다시 조회하며 raw 색을 복사하지 않는다.
- `app/theme.ts`의 기존 공개 키를 보존한다. 디바이스 모드 또는 설정의 시스템/라이트/다크 선택을 하나의 테마로 공급한다. 카테고리는 `categoryGroups`로 묶고 `categoryColors[mode][group]`의 bg/text를 사용한다. 12개 카테고리를 색만으로 구별하지 않는다.
- Pretendard 정적 Regular 400 / Medium 500 / SemiBold 600 / Bold 700을 로컬 `expo-font`로 로드한다. 각 weight에 맞는 family 이름은 `meta.fontFamily`. 네트워크 CDN에 의존하지 않는다. 폰트 로드 실패 시 System/sans-serif로 계속 사용할 수 있다. 폰트 자산 설치·라이선스 보관은 coder 담당.
- `typography.body`=16/24, `label`=14/20, `caption`=12/18, `resultTitle`=28/36, `heading`=32/40, `display`=48/56. 본문·버튼에 임의 축소 금지. 큰 글자 허용, 줄 수 제한 없이 늘어난다.
- 390×844, 페이지 좌우 `space.page`=20 → 본문 폭350. top/bottom safe area는 실제 기기 값을 사용한다. 캡처 기준30/20은 미리보기뿐이다. 기본 헤더 `sizes.headerMinHeight`=64, 하단 탭 `sizes.tabBarMinHeight`=70+bottom inset. 본문 ScrollView는 탭을 제외한 영역에서 스크롤한다.
- 주 간격 `space.sm/smPlus/md/lg/xl`=8/12/16/24/32. 카드 `radius.md`=20, 버튼 `radius.button`=14. 모든 주요 터치48 이상, 절대 하한44. 높이는 최소값이며 844에 화면을 고정하지 않는다.

## 공통 상태 계약

| 상태 | 면 / 글자 / 선 | 동작·표현 |
|---|---|---|
| 기본 primary | `colors.primary` / `onPrimary` | Button 아이콘20+gap8+문구, 가운데 정렬 |
| 기본 secondary | `surface` / `text` / `border` 1 | 주 버튼과 같은 높이, 보조 행동도 읽을 수 있게 유지 |
| 눌림 primary | `primaryPressed` / `onPrimary` | `motion.pressMs`100, scale `motion.pressScale`0.98. 복귀100ms, easing.standard |
| 눌림 secondary·행 | `surfacePressed` / `text` | 100ms, 텍스트와 아이콘 색 유지. 그림자 추가 없음 |
| 선택 칩·요일 | `primary` / `onPrimary`, 선2 | 체크 아이콘 또는 selected 접근성 상태+굵기. 색만으로 의미 전달 금지 |
| 비활성 | `disabledBg` / `disabledText`, opacity1 | 접근성 disabled. 비활성 사유는 인접 caption. 터치·햅틱·중복 요청 없음 |
| 로딩 | 기본 면 유지, spinner+“확인 중이에요” | 너비·최소 높이 유지, busy, 중복 클릭 차단. 스피너는 장식, 문구는 상태변화 시 1회 읽음 |
| 오류 | `errorBg` / `error` + 경고 아이콘 | 오류 제목·다음 행동을 함께 표시. 입력·선택 유지, 원시 스택/HTTP 내부정보 없음 |
| 포커스 | `focus`, `border.focus`3 | 웹 키보드에서 외곽선. native는 읽을 수 있는 label/state. 키보드와 고정 탭에 가리지 않음 |

모든 상태는 라이트/다크 동일한 토큰 이름으로 적용한다. 경고는 `warnBg/warn`, 카메라 위 UI는 `cameraBg/onCamera`, 스크림은 `overlay`다. 비활성 색에 opacity를 곱해 대비를 떨어뜨리지 않는다.

## U1 컴포넌트 계약

| 컴포넌트 | 구조·치수 | 상태·구현 완료 조건 |
|---|---|---|
| Button | 최소52, x `space.md`16 / y `smPlus`12, radius.button, label typography.button | primary/secondary/ghost. 기본·눌림·비활성·loading 제공. primary/capture/choice haptic은 성공한 사용자 입력에 각각 light/medium/selection, 오류는 최초1회. 웹은 무음으로 정상 동작 |
| Card | x/y `space.page`20, gap.md16, radius.md, divider1, surface | 정적인 카드는 터치 효과 없음. 클릭 카드만 surfacePressed. title/내용/하단행 자유 높이. 기본 shadow.none, 겹치는 시트만 shadow.overlay |
| Chip | minH48, x.smPlus12 / y.sm8, gap.iconGap6, radius.pill | 기본 surface/text/border1, 선택 primary/onPrimary/선2. 비활성 공통 규칙. 문구가 길면 다음 행으로, 줄바꿈 시 높이 증가 |
| CategoryBadge | icon20 + 정확한 카테고리 label14/20, x.chipX10 / y.xs4, gap.iconGap6, radius.pill | `categoryColors[mode][group]`. 비조작 뱃지는 48 높이 불필요. 탭 기능이 있으면 외부 터치48. 로딩은 스켈레톤, unknown에 가짜 카테고리 금지 |
| Sheet | 전체 폭390, 위 radius.lg28, surfaceRaised, x.page20, handle40×4, max85% viewport | 열기280ms easing.enter + scrim fade200ms. 닫기200ms easing.exit. dismiss 버튼48, back/배경탭 동작. 본문 스크롤·키보드 회피·포커스 가두기 및 닫힌 뒤 호출자로 복귀. 드래그만으로 닫게 만들지 않음 |
| Skeleton | colors.skeleton / skeletonHighlight, line16, gap12, radius.sm8 | 의미가 다른 블록 크기 예약. 1200ms opacity0.55→1→0.55 easing.standard 반복. reduced motion은 정지. 상태 문구 “배출 방법을 확인하고 있어요”, 임의 진행률/3초 카운트다운 금지 |
| Toast | text/bg 반전, x.md16 / y.smPlus12, radius.button, minH48, maxW350 | tab 위 gap.smPlus12, 180ms fade easing.standard, 4000ms 노출. 닫기48. 보조 확인만 사용, 필수 오류나 출처·일정 정보를 자동 사라지는 toast에 넣지 않음 |
| EmptyState | icon48, 제목 section18/26, 본문16/24, gap.md16, padding.lg24, radius.md | 빈 목록·unknown·오프라인 각각 전용 문구+아이콘+복구 CTA. 상단 경고·입력 오류와 혼동하지 않음 |

## 합성 요소

| 요소 | 배치 | 중요한 상태 |
|---|---|---|
| AppHeader | min64, 좌우20, SaLLiM+슬로건, 동네버튼 min48 | 긴 지역명은 줄바꿈. 지역 로딩은 짧은 skeleton, 지역 오류는 선택 행동 유지 |
| StepList | 번호28, gap.smPlus12, 행 y.smPlus12, divider1 | steps 순서 그대로. 완료 체크는 로컬 사용상태일 뿐 분류 확신 변경 아님. 큰 글자에서 행 높이 증가 |
| ScheduleCard | tint/text, padding.md16, radius.md, gap.sm8 | “다음 배출 요일”, 요일·시간·note 순. note는 출처 접기 안으로 숨기지 않음 |
| WeekSelector | 7개, 본문350에서 gap.xxs2, 각(350−12)/7≈48.3×52 | 오늘은 “오늘” 표시, 선택은 checked/selected. 320폭이면4+3줄,44 미만 금지. 선택 요일은 오늘 API 필드와 별개 |
| SourceDisclosure | minH48, icon20, caption12/18, gap.sm8 | 펼침 label/state. 각 링크 최소48, 제목·자료 기준·공식 홈페이지 링크 여부 원문. 링크 실패는 페이지 외부 연결 실패 안내 |
| Input | minH52, padding.input14, radius.button, body16/24, border1 | 항상 보이는 label. focus3, error 선 error+필드 바로 아래 설명. placeholder=colors.placeholder. 비활성 공통 규칙 |
| BottomTabs | 홈/찍기/물어보기/설정 4개, min70+safeBottom | 아이콘24+navigation12/18. 현재 탭 selected, active primary. 비활성 단순 opacity 없음. 카메라는 전체화면에서 탭 숨김 |

## API 필드와 신뢰 표시

| 데이터 | 표시 규칙 |
|---|---|
| item_key / item_name / category | null이면 unknown. 영문 키 노출·가짜 카테고리 생성 금지. 제목 원문 전체 줄바꿈 |
| answer / steps | 본문과 번호 체크리스트. 전체 원문, 배열 순서 유지. Markdown 말풍선 없음. 빈 steps에 번호 생성 금지 |
| next_days / time | “다음 배출 요일”로 표시, 날짜·D-day·내일 계산 금지. [] → “배출 요일 확인 필요”, null → “배출 시간 확인 필요” |
| note | 결과는 요일·시간 바로 아래, 홈은 주간 표 바로 아래. null/미제공이면 제거 |
| confident | false+item_key 존재면 “품목 후보”+경고. 클릭만으로 true 금지. 후보 일정은 “이 품목이 맞다면”과 함께 표시 |
| follow_up | null이면 질문 행동 제거. 있으면 question 원문+예/아니오 Sheet. key는 내부 요청용. false도 누적 상태에 유지 |
| sources | 제목·URL·updated 원문, updated 레이블 “자료 기준”. []이면 “출처 확인이 필요해요”. 확인일로 바꾸지 않음 |
| today / today_categories / week | 서버 today가 오늘. 선택 요일은 독립 상태. 빈 목록으로 배출 금지 추론 금지. 많으면 앞2+“외 N종”와 전체목록 Sheet |

카테고리 정확한 이름12개: 투명페트 / 플라스틱 / 종이 / 종이팩 / 캔·고철 / 유리병 / 비닐 / 스티로폼 / 일반쓰레기 / 음식물 / 전용수거 / 대형폐기물. SVG 대응은 `icons/manifest.json`, 최종 앱 복사본은 D3에서 제공한다.

새 사진/텍스트 질문이면 이전 ItemState 초기화, 되묻기는 has_label/has_contents/is_dirty/is_coated 중 서버 key에 true/false 누적. followup 실패는 기존 결과와 선택 답을 유지하고 질문 영역에 재시도. 지역 변경 시 이전 지역 결과를 새 지역처럼 보여주지 않는다. API가 반환하기 전 예시 결과를 실제 안내로 노출하지 않는다. Mock이면 “예시 데이터 · 실제 배출 안내가 아니에요”를 홈·결과에 보인다.

## 모션·접근성

기본 곡선 `motion.easing.standard`=[0.2,0,0,1], 진입 enter=[0.16,1,0.3,1], 퇴장 exit=[0.4,0,1,1], 스캔 linear=[0,0,1,1]. 화면200ms, 카드260ms+Y16→0, 요소별 지연40ms 최대3개. 실제 결과 도착과 동시에 진입하며 애니메이션을 위해 대기시키지 않는다. reduced motion은 이동·반복·scale을 0ms로 끄고 텍스트·최종 레이아웃만 유지. 설정 테마 전환180ms 색 전환, 레이아웃 유지.

장식 SVG는 접근성 읽기 제외. 버튼·출처·요일·체크리스트는 label/role/state 제공. 결과 완료는 제목, 오류는 오류 제목으로 포커스 이동하고 재시도 중 화면 전체가 반복 읽히지 않게 한다. 글자200%·320폭에서 줄바꿈, 세로 스크롤, 클릭44 이상을 지킨다. 입력 제출 CTA는 키보드 위에서 접근 가능해야 한다.

## 검증 범위

색 대비 계산은 [D1 검증](verification-d1.md). 스펙은 앱의 TalkBack·실기기 대비/키보드/카메라 검증을 대신하지 않는다. D4에서 구현과 비교하며 실제 APK는 coder/lead 검증 범위다.
