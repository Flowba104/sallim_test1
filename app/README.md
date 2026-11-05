# SaLLiM app

- `EXPO_PUBLIC_API_URL` 없으면 mock(예시 데이터) 모드. 화면에 경고가 뜬다.
- `app.json`의 `usesCleartextTraffic: true`는 http 서버용 임시 설정 — 서버를 HTTPS로 올리면 제거.
- `eas.json`의 `CHANGE_ME`는 실제 서버 주소로 교체 (빌드는 사람이 실행).
copy .env.example .env