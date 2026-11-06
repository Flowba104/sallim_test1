# D2 · 화면 명세 인덱스

2026-11-06 · A 살림 노트 확정 · 390×844 RN logical px. 공통 구현 기준은 [components.md](../components.md)와 [tokens.json](../tokens.json) v2.0.0. 파일별 상태표는 기본/눌림/비활성/로딩/오류를 모두 포함한다.

| 화면 | 명세 | 주요 검토 |
|---|---|---|
| U2 | [온보딩·동네 선택](U2.md) | 첫 실행/건너뛰기/빈 지역/저장실패 |
| U3 | [홈](U3.md) | 오늘 안내장/주간 요일/촬영 CTA/최근/출처 |
| U4 | [촬영](U4.md) | 전체화면/권한/앨범/취소/스캔 |
| U5 | [결과 카드](U5.md) | 카테고리/절차/요일·note/출처/되묻기 |
| U6 | [이름으로 물어보기](U6.md) | 검색 입력/추천 칩/같은 결과 카드 |
| U7 | [모든 상태](U7.md) | 로딩/unknown/후보/오프라인/서버오류/빈값 |
| U8 | [손맛](U8.md) | ms·곡선/햅틱/테마/reduced motion |
| U9 | [설정](U9.md) | 동네/모드/출처/유의사항/버전/문의 |

## 문구 우선순위

실제 API 원문(question/answer/steps/note/source)은 API 값 그대로. UI 고정 문구는 researcher의 `docs/research/ux-copy.md` 최종 키/값이 우선이고 개별 명세 예문은 연결 전 자리다. 기본 슬로건은 사용자 지정 **삶을 간단하게**. 문구가 길어지면 레이아웃을 늘리고 원문 축소·말줄임 금지.

- 결과 key 대소문자: `result.followUp.*`가 정식, `result.nextDays.title/unknown`, `result.time.unknown`, `result.lowConfidence.*`, `result.unknown.*`.
- 촬영은 `capture.header`, `capture.button.album`, `capture.scanning.title/body/cancel` 사용.
- 검색은 `ask.title`, `ask.placeholder`, `ask.submit`, `ask.chips.title/subtitle`. 칩은 입력을 채우고 CTA가 요청한다. 카피가 즉시 요청처럼 읽히면 researcher와 정렬한다.
- 추가 제안 키(capture.privacy/slow, result.followUp.open, ask.input.label/hint/errorEmpty, ask.chips.more, settings.theme.saveError/contact.unavailable)는 MSG-0032로 researcher에 전달했다. 존재하지 않는 키를 그대로 사용자에게 노출하지 않는다.

## 공통 QA 축

390×844 라이트/다크, 320폭과 200% 글자, 터치44 이상(주요48), safe area·키보드·스크롤, 상태변화1회 읽기, 긴 한국어와 출처, API 빈값, 취소후늦은응답, 지역변경·재시도 입력보존. 문서검사와 색 대비 계산을 통과해도 실제 앱/기기 검증 완료는 아니다. 구현 QA는 D4에서 별도 기록한다.
