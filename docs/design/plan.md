# SaLLiM 디자인 초안 제작 계획

사용자와 lead가 D1~D7 순서의 자동 실행을 지정했다. 승인 대기·git·서브에이전트 없이 디자이너가 직접 진행한다. 파일 수정은 docs/design/만 허용한다. 최신 human MSG-0021 우선: 2026-11-04 17:30 새 항목 시작 금지, 18:00 마감. Drive 복사는 lead만 수행한다.

기준: [directions.md](directions.md), MISSION의 AskResponse/ScheduleResponse. 도구: 단일 HTML/CSS/inline SVG, Python 파일 생성, Playwright(가능한 경우).

- [x] D1 `directions.md`: 네 방향의 색·타이포·형태·톤을 문서화. 방향 간 레이아웃 차이를 확인하고 완료 메일.
- [x] D2 `drafts/{warm-note,clear-grid,paper-light,bold-signal}/index.html`: 각각 390×844 여섯 화면. 실제 데이터 필드, 출처, 불확실성, 예/아니오를 확인하고 완료 메일.
- [x] D3 각 방향 `01-region.png`~`06-question.png`: 브라우저로 캡처. 이미지 치수·콘솔 오류·넘침 확인. 설치가 10분 넘으면 HTML만 남기고 캡처 불가 보고.
- [x] D4 `states/index.html`, `states.md`: 로딩·unknown·확신 낮음·통신 오류·빈 동네. 각 상태가 확정 분류/요일을 만들지 않는지 확인.
- [x] D5 `compare.md`: 동일한 기준으로 네 안 비교, 추천 한 안과 이유.
- [x] D6 `tokens.json`, `components.md`: px 숫자·hex, API 필드 대응, 버튼·결과·일정·상태 컴포넌트 명세.
- [x] D7 `icons/*.svg`: 12개 정확한 카테고리 이름에 대응, 24×24, 2px 선. XML 파싱과 누락 확인.

최종 확인: 산출물 개수, 캡처 치수, 본문 대비, 48px 터치, 소스 링크, 키보드 포커스, HTML 단독 열기, 예/아니오 데모, 작은 화면·확대 시 스크롤. 실제 Expo 앱·기기 검증은 범위 밖이며 보고에 명시한다.

2차 범위(1차 완료 후 순서대로): 추천안 온보딩 3장·설정·빈 상태 → 앱 아이콘·스플래시 초안 → 플레이스토어 스크린샷 5장 초안. 모두 docs/design/ 안에만 저장.

- [x] D8 추천안 확장: extended/index.html 온보딩3장·설정·빈안내 + PNG5장
- [x] D9 앱아이콘·스플래시 초안
- [x] D10 플레이스토어 스크린샷5장 초안
