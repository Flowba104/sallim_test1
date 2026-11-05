# SaLLiM 야간(→주간) 작업 보고서 — 2026-11-04

> 작성: lead · 최종 2026-11-04 07:12 (마감 18:00보다 일찍 전원 목록 완료 → 토큰 절약 위해 조기 종료)

## 1. 한 줄 요약

서버(FastAPI, 테스트 32개 통과)·앱(Expo, tsc·Android 번들 통과)·관악구 데이터(품목 67개 + 지역 1개, 전부 출처 있음)·디자인 4안·추천안 토큰/아이콘·온보딩·앱 아이콘·스토어 스크린샷까지 **1차·2차 목록 전부 완료** (07:12). 실제 VLM 호출·실기기 실행은 아직 안 했다.

## 2. 에이전트별 완료 / 미완료

| 에이전트 | 완료 | 미완료 / 비고 |
|---|---|---|
| lead | L1~L10, 2차: vlm-hints 프롬프트 반영, 테스트 보강(실데이터 검증·프롬프트), `server/Dockerfile`+`docs/agents/deploy-guide.md`, `README.md` | Docker 미설치라 이미지 빌드 미검증 |
| coder | C1~C8, 추가 C9(번들·실서버 확인), C10(eas.json), C11(note), C12(tokens→theme.ts), C13(상태 화면), C14(카테고리 아이콘) | 실기기/Expo Go 미실행, 스크린리더 미검증, 로딩 취소 버튼 없음 |
| designer | D1~D7, 2차: D8 온보딩3·설정·빈 일정(`docs/design/extended/`), D9 앱 아이콘·스플래시(`docs/design/brand/`), D10 스토어 스크린샷 5장(`docs/design/store/`) | 온보딩·설정·스플래시·앱 아이콘은 **앱에 아직 미적용**. 스토어 스샷은 디자인 예시(실제 앱 캡처로 교체 필요) |
| researcher | R1~R6, 2차: 1글자 별칭 정리, 출처 재검증, `docs/research/eval-plan.md`(30개) | items는 67개(60 목표 초과) |

리뷰 기록: `docs/agents/review-log.md` (수정 요청 → 재승인 과정 포함: C2·C4·C10·R1).

## 3. 실행 방법

**서버**
```bash
cd server
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt   # 오늘은 Python 3.14로 확인
cp .env.example .env                                                 # VISION_PROVIDER=mock
.venv/bin/python -m pytest -q                                        # 32 passed
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --env-file .env
curl -X POST localhost:8000/ask -H 'content-type: application/json' -d '{"region_id":"seoul-gwanak","question":"생수병"}'
```
→ "투명 페트병은 투명페트로 버려요. 서울특별시 관악구는 목요일 18:00~24:00에 내놓아요." + 되묻기(has_label) 확인함.

**앱**
```bash
cd app && npm install --legacy-peer-deps
EXPO_PUBLIC_API_URL=http://<PC IP>:8000 npx expo start     # 없으면 mock 모드(화면에 '예시 데이터' 표시)
```

**디자인 초안**: 브라우저로 `docs/design/index.html` 열기 (4안 × 6화면, 상태 화면, 토큰, 아이콘 링크). PNG는 `docs/design/drafts/<방향>/*.png`.

## 4. 결정한 것과 이유 / 사람이 정해야 할 것

**결정 (lead)**
- **시간 규칙**: 시작이 11/04 06:38이라 MISSION의 11/03 마감 대신 human MSG-0010 → MSG-0021(18:00 마감, 17:30 새 작업 금지)을 따름.
- **확신 낮음(<0.6)**: 품목 추정은 보여주되 `confident=false` + "다시 찍거나 이름으로 물어봐 주세요", 되묻기 없음. 앱은 "○○으로 보여요" 후보 표현 + 재촬영/이름 질문 버튼. 이유: 아무것도 안 보여주는 것보다 단서가 되지만, 확정 안내로 보이면 안 됨.
- **되묻기 의미**: 질문에 "예" = `state[key]=true` ("라벨이나 스티커가 **아직 붙어 있나요**?"). 앱·서버·디자인 문구를 통일. `conditions` 문장은 true일 때만 붙음. 앱은 답을 누적해 보냄(안 그러면 무한 반복 — C4에서 잡음).
- **API에 `note` 필드 추가** (AskResponse·ScheduleResponse, 선택 필드): 관악구 요일은 단독주택·상가 기준이고 아파트는 다름 → 이 경고가 앱에 보여야 과태료 위험이 줄어듦.
- **동네 전용 안내 분리**: `items.json`은 전국 공통, 관악구 전용(전용수거함 위치 등)은 `regions/seoul-gwanak.json`의 `overrides[item_key]` → 답변 첫 문장으로 사용.
- **텍스트 매칭**: 이름/별칭 정확 일치 → 문장 안 가장 긴 별칭. 같은 길이로 두 품목이 걸리면 고르지 않고 프로바이더 fallback(현재 mock → unknown).
- **Mock 프로바이더**: 실사진은 항상 unknown. 테스트는 `MOCK:<key>` 바이트로.
- **앱 production 빌드 안전장치**: `EXPO_PUBLIC_API_URL`이 없으면 mock(가짜 안내)이 나가므로 결과 화면에 항상 '예시 데이터' 경고. `eas.json`에 `CHANGE_ME` 자리표시.
- **react-native-svg 추가 승인** (아이콘용, Expo 공식 지원 패키지).

**사람이 정해야 할 것**
1. 디자인 방향 최종 선택 (추천: A 살림 노트 — 토큰·앱 테마는 이미 A로 적용, 바꾸면 `tokens.json`·`app/theme.ts` 교체). 앱 아이콘 초안(`docs/design/brand/`)은 접힌 문서+목록 심볼이라 분리배출보다 문서·메모 앱처럼 읽힐 수 있음 — 확인 필요.
2. 실제 VLM 프로바이더(claude/gemini)와 모델, 월 사용 한도.
3. 서버 호스팅 위치와 HTTPS 여부 (HTTP면 `usesCleartextTraffic` 유지 필요).
4. 공개 서버라면 `/ask` 인증·요청 제한 방식 (현재 없음 → 누구나 호출해 과금시킬 수 있음).
5. 동네 추가 여부(마포구 등).

## 5. 알려진 문제·리스크

**데이터 (가장 중요)**
- 관악구 출처가 **루트 URL**뿐: `https://www.gwanak.go.kr`, `https://smartclean.gwanak.go.kr` (세부 페이지 미확보, `docs/research/source-notes.md`). 요일제(목: 투명페트·비닐, 토: 배출 금지)·시간(18~24시)·전화번호·수거함 위치는 **researcher 보고 기준이며 lead가 직접 확인하지 못함** → 출시 전 구청 공지로 한 번 대조 필요.
- 전국 기준 출처 "기후에너지환경부 훈령 제18호 (law.go.kr admRulSeq=2100000213032)" — researcher가 확인했다고 보고, lead 미검증.
- `wasteguide.or.kr`는 루트 URL을 보조 출처로 병기(48개 품목).
- 지자체마다 다른 품목(과일 완충재, LED 전구, 불연성 마대 등)은 전국 문장으로 써 있어 다른 동네 추가 시 overrides 점검 필요.
- 경쟁 조사의 타사 기능 주장(예: 공식 앱 카메라 인식 없음)은 미검증. "환각 원천 차단"은 과장 — 배출법 생성은 막지만 **품목 오인식은 여전히 가능**.

**코드**
- 실제 VLM 미호출: Claude/Gemini 프로바이더는 작성만 함(오늘 규칙상 실행 금지). 응답 파싱은 단위 테스트로만 확인. 모델 ID 기본값(`claude-sonnet-5-5`, `gemini-2.5-flash`)은 환경변수로 바꿀 수 있음 — 사용 전 확인.
- VLM 프롬프트가 ~9.9k자(품목 67개 + 혼동 규칙) → 호출당 입력 토큰이 큼. 실제 사용 시 prompt caching 권장.
- `/ask`에 인증·rate limit 없음. CORS 전체 허용(쿠키 없음).
- 앱: 실기기·Expo Go·카메라 권한·스크린리더 미확인. `npm install`에 `--legacy-peer-deps` 필요. npm audit moderate 5건 미조치.
- Dockerfile 미빌드(환경에 docker 없음).
- 서버 테스트 경고: starlette TestClient가 httpx 사용 deprecated 경고 (동작엔 영향 없음).

## 6. 토큰 사용 요약

07:11 `agt usage` (추가 결제·extra usage 선택 없음, 유료 API 호출 0회)

| 에이전트 | 모델 | 입력 | 출력 | 캐시 | 합계 |
|---|---|---|---|---|---|
| lead | claude/opus | 564 | 185.7k | 32.7M | 32.9M |
| coder | claude/sonnet | 230 | 67.9k | 8.9M | 9.0M |
| designer | codex/sol-latest-high | 8.3M | 80.5k | 8.1M | 16.6M |
| researcher | antigravity/latest-high | (로그 없음) | | | |

한도: claude 5시간 28%·7일 4% / codex 5시간 24%·7일 4% / agy 조회 불가. 90% 넘은 CLI 없음.

## 7. 내일 첫 할 일 3개

1. **관악구 데이터 대조**: 구청 청소행정과 공지(세부 페이지)로 요일제·시간·토요일 금지를 확인하고 `data/regions/seoul-gwanak.json`의 `sources` URL을 세부 페이지로 교체.
2. **실기기 한 바퀴**: PC에서 서버(mock) 띄우고 `EXPO_PUBLIC_API_URL`로 Expo Go 실행 → 홈/찍기/물어보기/되묻기/설정 확인. 그다음 프로바이더·한도를 정하고 `eval-plan.md` 30개를 찍어 `eval.run_eval`로 정답률 측정.
3. **디자인 방향 확정 + APK**: 방향·앱 아이콘 선택 → 온보딩/스플래시/아이콘을 앱에 적용(`app.json` icon·splash) → 서버 배포 주소 확정 → `eas.json` `CHANGE_ME` 교체 → `eas build -p android --profile preview`.

## 8. 레포로 옮길 파일 목록

**옮길 것**
- `README.md`, `.dockerignore`
- `app/` — 단 `node_modules/`, `.expo/` 제외 (`AGENTS.md`, `README.md`, `app.json`, `eas.json`, `package.json`, `package-lock.json`, `tsconfig.json`, `theme.ts`, `app/`, `components/`, `lib/`, `assets/`)
- `server/` — 단 `.venv/`, `__pycache__/`, `.env` 제외 (`Dockerfile`, `requirements.txt`, `.env.example`, `app/`, `tests/`, `eval/`)
- `shared/api-types.ts`
- `data/items.json`, `data/regions/seoul-gwanak.json`
- `docs/design/` 전체 (PNG 포함), `docs/research/` 전체, `docs/agents/` (review-log, deploy-guide), `docs/REPORT-2026-11-04.md`

**옮기지 말 것**: `server/.venv/`(74MB), `app/node_modules/`(461MB), `app/.expo/`, `**/__pycache__/`, `.env`, `.agent-mail*/`, `scripts/agent-team/`

**복사 명령 예시** (레포 경로를 `~/projects/sallim` 이라고 가정)
```bash
rsync -a \
  --exclude node_modules --exclude .venv --exclude .expo --exclude __pycache__ \
  --exclude .env --exclude '.agent-mail*' --exclude scripts/agent-team \
  ~/projects/sallim-night/ ~/projects/sallim/
cd ~/projects/sallim && git status   # 확인 후 커밋
```
(이 폴더는 시간마다 위 규칙으로 Google Drive `HGU/SW페스티벌_sallim/`에도 복사됨)
