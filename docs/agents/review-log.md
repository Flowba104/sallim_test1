# Review log

시각 | ID | 결과 | 메모
---|---|---|---
06:41 | D1 | 승인 | 4안 색·타이포·형태·톤 명확, 데이터 미검증 표기·접근성 기준 포함
06:41 | C1 | 승인 | Expo SDK58+expo-router 4탭, tsc 통과, app/.git 없음. npm audit moderate 5건 미조치
06:42 | C2 | 수정요청 | mock follow_up 문구가 has_label 의미와 반대, detail 미노출, mock 일정 표시
06:43 | C2 | 승인 | follow_up 문구 서버와 일치, detail 노출, mock 예시 표시
06:43 | C3,C5,C6,C7,C8 | 승인 | 1024px/JPEG0.7 리사이즈, AsyncStorage, 첫 실행 이동, tsc 통과. 실기기 미확인
06:43 | C4 | 수정요청 | 되묻기 상태 비누적 → 2단계 되묻기 무한 반복
06:43 | C4 | 승인 | 상태 누적 + 새 질문마다 리마운트, 48px 버튼, tsc 통과
06:44 | C9 | 승인 | expo export android 성공, 픽스처 서버로 되묻기 2단계·404 detail 확인
06:44 | C10(eas.json) | 수정요청 | 릴리스 APK 평문 http 차단, production에 API URL 없어 mock 동작
06:45 | C10 | 승인 | cleartext 플러그인, production URL 자리표시, 결과화면 mock 경고. 주의: npm install --legacy-peer-deps 필요(react-dom peer ERESOLVE)
06:47 | R1 | 수정요청 | 스키마 통과(62개). 무의미 conditions 4건, 루트 URL 출처 48건, 관악구 전용 내용 items에 혼입
06:48 | R2 | 승인(조건부) | 67개 스키마·별칭 OK, 필수 헷갈림 품목 포함. MSG-0029 수정(conditions 4건·출처) 대기
06:48 | D2 | 승인 | 4안×6화면 단일 HTML, 외부자원 Pretendard CDN만, 되묻기 문구 서버와 일치, 예시 데이터 표기
06:50 | R3 | 승인(리스크) | 관악구 일~금 18~24, 토 금지, 목 투명페트·비닐 요일제. 스키마·서버 기동·curl OK. 출처가 구청 루트 URL뿐 → REPORT 리스크. 아파트 예외는 note로 → API에 note 필드 추가
06:50 | R4 | 승인(리스크) | overrides 11·drop_off 6, item_key 일치. 전화번호·수거함 위치는 lead 검증 불가 → REPORT 리스크
06:51 | C11 | 승인 | note 표시(결과·홈), mock 예시 note, tsc 통과
06:53 | D3 | 승인 | PNG 24+overview 4, 실데이터(목요일·note) 반영, 시각 확인함. 터치 44px 검증 vs D1 기준 48px → D6에서 확인
06:56 | R1(수정) | 승인 | conditions 정비, 전 품목 law.go.kr/easylaw 딥링크, 관악구 내용 overrides로 분리(13종), source-notes.md. URL 실제 접속 확인은 researcher 보고 기준(lead 미검증)
06:57 | D4 | 승인 | 상태 5종, 확신낮음=후보+재촬영(서버 동작과 일치), unknown·빈동네 추측 없음, note 배치
06:57 | R5 | 승인 | 경쟁 4종 비교·차별점 명확. 경쟁앱 기능 주장(카메라 인식 부재 등)은 lead 미검증, '환각 원천 차단'은 과장(오인식은 여전히 가능) → REPORT에 명시
06:58 | D5 | 승인 | A 살림노트 추천, 대비·구현부담 비교, 오너 미승인·미검증 범위 명시
06:59 | R6 | 승인·반영 | 혼동 14쌍·null 규칙 → providers/base.py STATE_GUIDE·DISAMBIGUATION_GUIDE 반영, 프롬프트 내 key 참조 전부 유효, pytest 32 통과. 프롬프트 ~9.9k자(호출당 비용 메모)
07:01 | D6 | 승인 | tokens.json(theme.ts 키 호환, 대비 4.5+), components.md 전 필드·note 포함. 터치 하한 44 → 앱은 48 적용 지시
07:02 | C12 | 승인 | theme.ts 토큰 복사, 하드코딩 제거, touchMin 48, tsc·export 통과. states.md 갭 4건 → C13
07:03 | D7 | 승인 | 12카테고리 SVG 자체 도형, currentColor·24px, manifest 매핑. designer 1차(D1~D7) 완료
07:03 | R7(2차) | 승인 | 67개 유지(60+ 충족), 1글자 별칭 정리, eval-plan 30개 item_key 전부 유효 → server/eval/labels-real.csv로 복사. researcher 전체 완료
07:04 | C13 | 승인 | 확신낮음 후보 표현+재촬영/이름질문, 재시도, 빈동네 비활성, 로딩 문구. tsc·export 통과
07:05 | C14 | 승인 | react-native-svg 15.16.0, 12 아이콘 값 복사, 장식 처리, tsc·export 통과. coder 전체 완료
07:06 | D8(2차) | 승인 | 온보딩3·설정·빈 일정 5화면, 범위 밖 기능 없음, 문구 과장 없음. 앱 구현은 미포함(내일)
07:08 | D9(2차) | 승인(메모) | 앱 아이콘·스플래시, 1024 PNG/SVG. 메모: 접힌 문서+목록 심볼이 '분리배출'보다 문서·메모 앱으로 읽힐 수 있음 → 오너 판단
07:11 | D10(2차) | 승인 | 스토어 스샷 5장 1080×1920, 전 장 '디자인 초안' 표기, 수치 주장 없음. designer 1·2차 전부 완료
07:11 | L10 | 완료 | REPORT 최종본, 최종 rsync, Drive/REPORT.md
07:12 | designer 최종 | 확인 | verification.md/json 갱신(HTML10·PNG49·SVG14 검증 PASS), 종료
