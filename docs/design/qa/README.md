# D4 · 구현 QA 기록

2026-11-06 · A 살림 노트 · 앱코드는 수정하지 않고 읽기/웹 export/브라우저 조작으로 검사했다. 원본기준은 [U1](../components.md)과 [U2~U9 명세](../specs/README.md).

## 검증 환경·재현 구분

- `npx expo export -p web --output-dir /tmp/sallim-web` 성공. 이후 수정본은 `/tmp/sallim-web-final`에 별도 export, 합성상태용은 `EXPO_PUBLIC_API_URL=/qa-api`로 `/tmp/sallim-web-fixtures[-final]`에 export했다. 앱소스 변경 없음.
- Chromium390×844, deviceScaleFactor1, 시스템 light/dark 각각, reduced-motion reduce. 추가320폭 긴질문. native OS글자200%/TalkBack/실기기카메라/햅틱/60fps는 검증하지 않았다.
- 기본24장+수정후24장+최종8장은 앱 built-in mock. 추가상태21장+최종probe6장은 Playwright가 `/qa-api` 요청을 가로채 합성응답을 제공했다. 실제서버/유료VLM·LLM 호출 없음. 합성답·출처는 제목/본문에 QA 표시.
- 첫 export 캡처 때4173은 coder가이미띄운 서버라 사용자지시대로 별도종료를요청했고 coder가종료확인했다(MSG-0074). 이후 모든캡처는 designer전용4174의직접서버프로세스를사용하고 finally종료후 포트닫힘을검증했다. PNG변환은 setContent만사용, 정적서버없음. 설치는추가하지않았고 저장소밖기존Playwright만사용했다.

## 화면별 결과

| 범위 | 보고서 | 검증·결과 |
|---|---|---|
| U1 공통 | [코드·추가QA](U1-code.md) | Sheet스크롤·safe inset/눌림100ms/Chip48 반영. 웹상태semantic·탭70/라벨12·18 최종확인 |
| U2 | [온보딩·지역](U2.md) | 3장양테마·건너뛰기·최초저장·지역[] 확인. radio checked 수정확인 |
| U3 | [홈](U3.md) | 오늘칩3줄→2줄48px·슬로건/지역 수정확인. 12품목Sheet끝까지스크롤 |
| U4 | [촬영](U4.md) | 권한닫기대비수정. native촬영미검증, 결과탭복원코드확인 |
| U5 | [결과](U5.md) | Mock경고부터첫표시·false답보존/재시도수정확인. 320긴질문닫기접근 |
| U6 | [물어보기](U6.md) | label/hint·Chip48 수정확인, 검색→결과·unknown |
| U7 | [상태](U7.md) | unknown/후보/연결실패/타임아웃/서버오류/로딩/지역[] 양테마. 취소후늦은응답무시 |
| U8 | [손맛·테마](U8.md) | 양테마일관·reduced-motion코드확인. 웹수동테마/새로고침유지확인·native진동미검증 |
| U9 | [설정](U9.md) | 실제지역·버전·출처링크/자료기준확장·문구확인. radio checked 수정확인 |

모든캡처세트에서 pageerror0. viewport안에서측정한버튼·탭·radio는44×44미만없음, document가로overflow없음. 색은 D1의34조합대비계산을따르며 본문최저5.03:1. 이결과는 앱전체접근성/실기기성능인증이아니다. 출처실제내용검증은 researcher/lead, API실서버연결은 lead/coder 담당.

최종 파일명은 `*-final.png`, `*-recheck.png`는 중간수정후이며 접미사없는PNG는초기/추가상태기록이다. UI변경중export를피하려고 각캡처세트는별도export디렉터리를고정해서사용했다. 세부문구는 researcher최종 `ux-copy.md`, 추천20개는 `faq-chips.md`로정렬했다.

## 최종 판정

디자이너가 지적한 시각·상태·웹 접근성 항목은 모두 반영 후 재검증했다. 완료된 QA 캡처83개와 화면별 보고서를 제공한다. 최종 웹 export와 `npx tsc --noEmit`은 exit0, 모든 성공 캡처세트 pageerror0. radio checked/Chip selected/출처 expanded, 탭70+라벨12/18, 테마선택·새로고침유지는 assert로 검증했다. 오류/로딩 fixture는 실제 서비스 정확도나 성능을 보장하지 않는다.

남은 확인: 실제 Android 카메라/앨범·런처아이콘·OS스플래시·safe area·글자200%·TalkBack·햅틱·60fps 및 실제 서버 연결. 작은 모션 차이로 테마180ms색전환은 즉시전환이며 native 검증과 함께 lead/coder에게 기록한다. 설정 문의경로 미정은 비활성 가짜버튼 없이 준비중 문구다. 미해결 디자인 차단 지적은 없다.

designer 캡처 종료 후4173/4174/4175 포트가 모두 닫힌 것을 확인했다. 실행 스크립트/테스트JSON/exports는 저장소 밖 `/tmp`에만 있다. 저장소에는 디자인 산출물만 추가했고 git/서브에이전트/앱코드 수정은 사용하지 않았다.
