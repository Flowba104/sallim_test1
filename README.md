# SaLLiM (살림) — 삶을 간단하게

사진을 찍으면 품목을 인식하고, **우리 동네 규칙**으로 분리배출 방법을 알려주는 앱.

```
[사진] → ① VLM: 품목만 판별 (data/items.json의 item_key 중에서, 모르면 unknown)
       → ② 데이터 조회: 품목 배출법 + 동네 요일·시간·전용수거
       → ③ 템플릿으로 답변 조립 (LLM이 배출법을 지어내지 않음)
       → 상태가 애매하면 되묻기 ("라벨이 붙어 있나요?") → VLM 없이 다시 조립
```

## 폴더

| 경로 | 내용 |
|---|---|
| `app/` | Expo(TypeScript, expo-router) 앱. 탭: 홈 / 찍기 / 물어보기 / 설정 |
| `server/` | FastAPI. `/regions` `/ask` `/ask/followup` `/schedule` |
| `shared/api-types.ts` | API 계약 (원본). 앱은 `app/lib/api-types.ts` 복사본 사용 |
| `data/items.json` | 품목 67개 — 전국 공통 기준, 항목마다 출처 |
| `data/regions/<id>.json` | 동네 요일·시간·전용수거·예외(note). 현재 `seoul-gwanak` |
| `docs/design/` | 디자인 4안·추천안 토큰·컴포넌트 명세·아이콘 (`docs/design/index.html`) |
| `docs/research/` | 출처 기록, 경쟁 조사, VLM 혼동 품목, 평가 계획 |

## 서버 실행

```bash
cd server
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cp .env.example .env            # 기본 VISION_PROVIDER=mock
.venv/bin/python -m pytest -q   # 테스트
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --env-file .env
curl -X POST localhost:8000/ask -H 'content-type: application/json' \
  -d '{"region_id":"seoul-gwanak","question":"생수병"}'
```

- 시작할 때 `data/`를 스키마로 검증한다. 틀리면 `DataError`로 바로 멈춘다 (출처 없는 품목도 거부).
- `VISION_PROVIDER=mock`은 실제 사진을 항상 unknown으로 돌려준다 (테스트용 바이트 `MOCK:<item_key>[:신뢰도]`만 인식).
  `claude`/`gemini`는 **유료 API 과금** — 키를 넣기 전에 콘솔 사용 한도부터 걸 것.
- 정확도 평가: `docs/research/eval-plan.md`의 30개 물건을 찍어 `server/eval/images/`에 넣고
  `.venv/bin/python -m eval.run_eval --provider <p> --labels eval/labels-real.csv`
- 배포: `docs/agents/deploy-guide.md` (`server/Dockerfile`, 레포 루트에서 빌드)

## 앱 실행

```bash
cd app
npm install --legacy-peer-deps      # react-dom peer 충돌 때문에 플래그 필요
EXPO_PUBLIC_API_URL=http://<PC의 IP>:8000 npx expo start   # 생략하면 mock 모드('예시 데이터' 표시)
npx tsc --noEmit
```

APK: `app/eas.json`의 `CHANGE_ME`를 실제 서버 주소로 바꾼 뒤 `eas build -p android --profile preview`.

## 데이터 규칙

- 품목 추가: `data/items.json`에 `item_key`(영문 snake_case, 안 바뀜), `category`(12개 중 하나), `steps`, `conditions`(키는 `has_label` `has_contents` `is_dirty` `is_coated`만), **`sources` 필수**.
- `conditions[key]` 문장은 그 상태가 **true(예)**일 때 안내에 붙는다. 모르면 그 키로 되묻는다.
- 동네 추가: `data/regions/<id>.json` (파일명 = id). 모르는 값은 비우고 추측하지 않는다. 아파트·동별 차이는 `note`.
- 틀린 배출 안내는 과태료로 이어진다 — 출처와 "모르면 모른다"가 제일 중요하다.
