# 개발 환경: 폰(Expo Go) ↔ PC 서버 연결

목표: 폰의 앱이 같은 Wi-Fi의 PC에서 도는 FastAPI 서버(`Mock` 프로바이더)를 부른다.

## 1. 서버 (PC)

```bash
cd server
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cp .env.example .env                     # VISION_PROVIDER=mock (유료 API 호출 없음)
.venv/bin/python -m pytest -q            # 전부 통과해야 함
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --env-file .env
```

- `--host 0.0.0.0` 이 없으면 PC 자기 자신(localhost)만 접속된다. 폰에서 안 되면 제일 먼저 확인.
- PC에서 확인: `curl localhost:8000/regions` → `[{"id":"seoul-gwanak",...}]`
- CORS는 전체 허용(`*`)이라 웹 미리보기(`localhost:8081`)에서도 바로 된다. 쿠키·로그인이 없어서 괜찮지만, 공개 서버로 올릴 땐 요청 제한·인증부터 정해야 한다.
- 포트 8000이 이미 쓰이고 있으면(예전에 띄운 서버) `ss -ltnp | grep 8000`으로 찾아 끄거나 `--port 8001`.

## 2. PC의 LAN IP 찾기

| PC | 명령 | 쓰는 값 |
|---|---|---|
| Windows | `ipconfig` | Wi-Fi 어댑터의 IPv4 (예: 192.168.0.10) |
| macOS | `ipconfig getifaddr en0` | |
| Linux | `hostname -I` | 첫 번째 |

**WSL2에서 서버를 돌리는 경우**: WSL의 IP(172.x)는 폰에서 안 보인다. 둘 중 하나:
- (쉬움) `%UserProfile%\.wslconfig`에 `[wsl2]` / `networkingMode=mirrored` 넣고 `wsl --shutdown` 후 재시작 → Windows IP로 바로 접속.
- 또는 관리자 PowerShell: `netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=<WSL IP>` (WSL IP: WSL 안에서 `hostname -I`)
- 어느 쪽이든 Windows 방화벽에서 TCP 8000 인바운드 허용: `New-NetFirewallRule -DisplayName sallim -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow`

폰 브라우저로 `http://<PC IP>:8000/regions` 가 열리면 연결 준비 끝.

## 3. 앱

```bash
cd app
npm install --legacy-peer-deps
cp .env.example .env                     # EXPO_PUBLIC_API_URL=http://<PC IP>:8000
npx expo start -c                        # -c: .env 바꾼 뒤엔 캐시 비우기 필수
```

- 폰에 Expo Go 설치 → QR 스캔. PC와 폰이 **같은 Wi-Fi**여야 한다(학교·카페 Wi-Fi는 기기 간 통신을 막는 경우가 많음 → 폰 핫스팟에 PC를 붙이면 됨).
- `EXPO_PUBLIC_API_URL`을 비우면 mock 모드: 서버 없이 예시 데이터, 화면에 '예시 데이터' 표시.
- Android는 HTTP(평문) 접속이 기본 차단이라 `app.json`의 `expo-build-properties` → `usesCleartextTraffic: true`로 열어 둠. HTTPS 서버로 바꾸면 끄기.
- 웹 미리보기: `npx expo start --web` 또는 `npx expo export -p web --output-dir /tmp/sallim-web && npx serve /tmp/sallim-web -l 4173`.

## 4. 오류가 나면

앱은 서버 오류 응답 `{"error":{"code","message"}}`의 `code`로 상태 화면을 고른다(목록: `shared/api-types.ts` `ErrorCode`). 응답이 아예 없거나 15초 안에 안 오면 `network` → "서버에 연결하지 못했어요".

| 증상 | 확인 |
|---|---|
| 앱이 계속 '예시 데이터' | `.env` 위치(`app/.env`)·키 이름 `EXPO_PUBLIC_` 접두어, `expo start -c` |
| 서버에 연결하지 못했어요 | 폰 브라우저로 `/regions` 열리는지 → 안 되면 2번(IP·WSL·방화벽·같은 Wi-Fi) |
| 알 수 없는 동네예요 | 앱에 저장된 동네 id가 서버 `data/regions/`에 없음 → 설정에서 동네 다시 선택 |
| 사진이 너무 커요 (413) | 앱이 긴 변 1024px JPEG로 줄여 보내는지. 서버 한도: 이미지 3MB, 요청 본문 약 4.1MB |
| 사진 분석이 오래 걸려요 (504) | 실제 VLM 프로바이더일 때만. 연결 5초·전체 12초 넘으면 끊음 (`server/app/providers/*.py` `TIMEOUT`) |

## 5. 사진 처리 (개인정보 문구 근거)

- `/ask`의 `image_base64`는 요청 처리 중 메모리에서만 쓰고 디스크·DB·로그에 저장하지 않는다(`server/app/main.py`).
- `VISION_PROVIDER=mock`이면 사진은 서버 밖으로 나가지 않는다. `claude`/`gemini`로 바꾸면 분류를 위해 해당 API로 전송된다(각 사 약관 적용).
