# 서버 배포 가이드 (초안 — 오늘 밤 실제 배포는 하지 않았음)

## 0. 먼저 정할 것 (사람)
- **VLM 프로바이더와 키**: `VISION_PROVIDER=claude|gemini` + 키. 실제 호출은 유료 과금이다. 키는 서버 환경변수로만 넣고 앱(APK)에 넣지 않는다.
- **호스팅**: 아래는 컨테이너 하나를 올리는 PaaS(Render, Fly.io, Cloud Run 등) 기준. 무료 티어는 잠들었다 깨어나는 지연(수십 초)이 있으니 시연 전에 미리 깨운다.

## 1. 로컬에서 컨테이너 확인
```bash
# 레포 루트에서
docker build -f server/Dockerfile -t sallim-api .
docker run --rm -p 8000:8000 -e VISION_PROVIDER=mock sallim-api
curl localhost:8000/regions
curl -X POST localhost:8000/ask -H 'content-type: application/json' \
  -d '{"region_id":"seoul-gwanak","question":"생수병"}'
```
- `data/items.json`이나 `data/regions/*.json`이 스키마에 안 맞으면 컨테이너가 **기동 시 바로 죽고** 로그에 `DataError: 스키마 오류: ...`가 찍힌다. 데이터 수정 후 다시 빌드.
- Dockerfile은 `PORT` 환경변수를 따른다 (없으면 8000).

## 2. PaaS에 올리기 (공통 순서)
1. 레포 연결 → Dockerfile 경로 `server/Dockerfile`, 빌드 컨텍스트 **레포 루트**.
2. 환경변수: `VISION_PROVIDER`, `ANTHROPIC_API_KEY` 또는 `GEMINI_API_KEY` (`server/.env.example` 참고).
3. 헬스체크 경로: `/regions` (200이면 정상).
4. 배포 URL을 앱 빌드 환경변수 `EXPO_PUBLIC_API_URL`에 넣고 APK를 다시 빌드.

## 3. 비용·안전 체크리스트
- [ ] 유료 키는 사용량 한도(콘솔의 월 한도)를 먼저 걸어 둔다.
- [ ] 지금 API에는 인증·요청 제한이 없다. 공개 URL이면 누구나 `/ask`로 VLM을 호출해 과금시킬 수 있다 → 시연 전 최소한 앱 전용 헤더 키 또는 요청 수 제한을 추가할 것 (TODO, 미구현).
- [ ] 이미지 크기 상한 8MB (서버에서 413). 앱은 1024px JPEG로 줄여 보낸다.
- [ ] 데이터 갱신(배출 요일 변경 등)은 `data/` 수정 → 재배포. 출처 `updated` 날짜도 같이 고친다.
