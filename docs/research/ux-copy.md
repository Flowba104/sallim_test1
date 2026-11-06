# SaLLiM UX 문구 명세 (`ux-copy.md`) — R1

> **문구 원칙**
> 1. **어조 통일:** 친근하고 정중한 해요체 존댓말(`~해요`, `~해 주세요`, `~인가요?`)로 통일합니다.
> 2. **길이 제한:** 한 문장은 25자 안팎으로 짧고 명확하게 유지하여 320px 소형 화면이나 200% 큰 글자에서도 읽기 쉽게 합니다.
> 3. **명령보다 안내:** 강압적인 지시(`제거하십시오`, `투입 금지`) 대신 행동 중심 안내(`라벨을 떼 주세요`, `전용 수거함에 넣어 주세요`)를 씁니다.
> 4. **솔직한 불확실성 표현:** 확신이 낮거나 데이터가 비어 있을 때 단정하지 않고 솔직하게(`정확하지 않을 수 있어요`, `배출 요일 확인 필요`) 안내합니다. 과장·유행어·챗봇 말투를 쓰지 않습니다.

---

## 1. 공통 및 탭 내비게이션 (`common.*`, `tabs.*`)

| 키 (`key`) | 문구 (`value`) | 사용 위치 및 맥락 |
|---|---|---|
| `common.appName` | `SaLLiM` | 헤더 로고 및 기본 앱 타이틀 |
| `common.next` | `다음` | 온보딩 다음 장 이동 버튼 |
| `common.prev` | `이전` | 온보딩 2·3장 이전 이동 버튼 |
| `common.skip` | `건너뛰기` | 온보딩 상단 건너뛰기(동네 선택으로 이동) |
| `common.close` | `닫기` | 바텀시트·모달 닫기 버튼 |
| `common.cancel` | `취소` | 분석 대기 중 요청 취소 버튼 |
| `common.retry` | `다시 시도하기` | 공통 재시도 버튼 |
| `common.confirm` | `확인` | 공통 확인 버튼 |
| `common.yes` | `예` | 되묻기 긍정 응답 버튼 |
| `common.no` | `아니오` | 되묻기 부정 응답 버튼 |
| `common.mockNotice` | `예시 데이터예요 · 실제 배출 안내가 아니에요` | Mock 모드 활성화 시 상단 고정 캡션 |
| `tabs.home` | `홈` | 하단 탭 1: 오늘의 살림 안내장 |
| `tabs.capture` | `찍기` | 하단 탭 2: 카메라 촬영·앨범 인식 |
| `tabs.ask` | `물어보기` | 하단 탭 3: 이름 검색·자주 묻는 품목 칩 |
| `tabs.settings` | `설정` | 하단 탭 4: 동네 변경·출처·면책 안내 |

---

## 2. U2 온보딩 3장 및 동네 선택 (`onboarding.*`, `region.*`)

### 2-1. 온보딩 3장 (`onboarding.*`)

| 키 (`key`) | 문구 (`value`) | 비고 (글자 수 / 접근성) |
|---|---|---|
| `onboarding.photo.title` | `찍으면, 버리는 법이 보여요` | 1장 제목 (15자) |
| `onboarding.photo.body` | `물건을 찍고 알맞은 배출 방법을 확인해요.` | 1장 설명 (23자) |
| `onboarding.method.title` | `순서대로, 간단하게` | 2장 제목 (10자) |
| `onboarding.method.body` | `비우고, 헹구고, 분리하는 순서를 한눈에 봐요.` | 2장 설명 (25자) |
| `onboarding.region.title` | `우리 동네 기준으로` | 3장 제목 (10자) |
| `onboarding.region.body` | `사는 동네에 맞는 배출 요일을 확인해요.` | 3장 설명 (21자) |
| `onboarding.start` | `동네 선택하기` | 3장 마지막 CTA 버튼 |
| `onboarding.stepA11y` | `3장 중 {current}장` | 스크린리더용 페이지 인디케이터 대체 문구 |

### 2-2. 동네 선택 (`region.*`)

| 키 (`key`) | 문구 (`value`) | 사용 상태 |
|---|---|---|
| `region.header` | `사는 동네 선택` | 상단 헤더 제목 |
| `region.title` | `사는 동네에 맞게 알려 드릴게요` | 본문 상단 헤딩 |
| `region.description` | `같은 물건도 배출일은 다르니까요.` | 헤딩 아래 보조 설명 |
| `region.loading` | `지원 동네를 불러오고 있어요` | `GET /regions` 로딩 스켈레톤 안내 |
| `region.error` | `동네 목록을 불러오지 못했어요` | `GET /regions` 네트워크·서버 오류 |
| `region.empty` | `아직 안내할 수 있는 동네가 없어요` | `regions=[]` 빈 목록 상태 제목 |
| `region.emptyBody` | `동네 데이터를 준비하고 있어요. 잠시 후 다시 확인해 주세요.` | `regions=[]` 빈 목록 보조 문구 |
| `region.retry` | `다시 불러오기` | 오류·빈 목록 재시도 버튼 |
| `region.selected` | `선택한 동네` | 선택된 동네 행 배지/접근성 라벨 |
| `region.help` | `동·공동주택에 따라 기준이 다를 수 있어요. 상세 주소와 위치 권한은 받지 않아요.` | 목록 하단 안심·예외 안내 캡션 |
| `region.confirm` | `이 동네로 시작하기` | 동네 선택 후 하단 고정 CTA |
| `region.pick` | `동네를 선택해 주세요` | 동네 미선택 시 비활성 CTA 문구 |
| `region.saveError` | `동네를 저장하지 못했어요. 다시 시도해 주세요.` | 로컬 저장 실패 시 인라인 오류 문구 |
| `region.removedNotice` | `이전에 선택한 동네를 찾지 못했어요. 동네를 다시 골라 주세요.` | 재실행 시 기존 저장 지역이 목록에 없을 때 |

---

## 3. U3 홈 / 오늘의 살림 안내장 (`home.*`)

| 키 (`key`) | 문구 (`value`) | 사용 위치 및 상태 |
|---|---|---|
| `home.slogan` | `삶을 간단하게` | 헤더 브랜드 서브 슬로건 |
| `home.eyebrow` | `오늘의 살림` | 상단 인사말 작은 제목 |
| `home.title` | `하나씩, 가볍게.` | 상단 인사말 메인 헤딩 |
| `home.today.title` | `오늘 내놓는 품목` | 오늘 배출 카드 섹션 타이틀/접근성 제목 |
| `home.today.label` | `오늘은` | 오늘 카드 상단 라벨 (`월요일` 위) |
| `home.today.daySuffix` | `요일` | 서버 `today`(`"화"`) 뒤에 붙여 `"화요일"` 표시 |
| `home.today.badgeLabel` | `오늘` | 주간 요일 칩 중 실제 오늘 표시 라벨 |
| `home.today.more` | `외 {count}종` | 오늘 배출 품목 2개 초과 시 요약 표기 |
| `home.today.all` | `오늘 배출 품목 모두 보기` | 전체 품목 바텀시트 열기 버튼 |
| `home.today.sheetTitle` | `오늘 배출할 수 있는 품목` | 전체 품목 바텀시트 상단 제목 |
| `home.today.empty` | `안내할 품목이 없어요. 동네 안내를 확인해 주세요.` | `today_categories=[]`일 때 (임의 '배출 금지' 단정 금지) |
| `home.today.timePrefix` | `배출 시간` | 배출 가능 시간 앞 라벨 (`배출 시간 18:00~24:00`) |
| `home.today.timeUnknown` | `배출 시간 확인 필요` | `time=null`일 때 표시 |
| `home.action.capture` | `찍어서 물어보기` | 메인 카메라 촬영 대형 CTA 버튼 |
| `home.action.ask` | `이름으로 물어보기` | 보조 텍스트 검색 이동 버튼 |
| `home.week.title` | `이번 주 배출 요일` | 주간 요일 섹션 제목 |
| `home.week.empty` | `안내할 품목이 없어요. 동네 안내를 확인해 주세요.` | 선택한 요일의 품목 배열이 비어 있을 때 |
| `home.recent.title` | `최근 확인한 물건` | 최근 질문 목록 섹션 제목 |
| `home.recent.empty` | `아직 확인한 물건이 없어요. 사진으로 첫 물건을 확인해 보세요.` | 최근 질문 기록이 없을 때 빈 문구 |
| `home.recent.otherRegion` | `다른 동네 기준` | 최근 기록의 동네가 현재 동네와 다를 때 표시 |
| `home.sources.toggle` | `출처 확인하기` | 하단 출처 펼치기/접기 버튼 |
| `home.sources.empty` | `출처 정보 확인 필요` | `sources=[]`일 때 표시 |
| `home.loading` | `동네 배출 일정을 확인하고 있어요` | 최초 일정 조회 스켈레톤 안내 |
| `home.refreshing` | `최신 안내를 확인하고 있어요` | 새로고침 중 상단 보조 문구 |
| `home.offlineCached` | `이전 안내예요. 연결 후 다시 확인해 주세요.` | 오프라인 상태에서 캐시된 일정 표시 시 |
| `home.error` | `배출 일정을 불러오지 못했어요` | 일정 조회 실패 시 카드 내부 오류 제목 |
| `home.noRegion` | `먼저 동네를 선택해 주세요.` | 동네 미선택 상태에서 진입 시 안내 |
| `home.pickRegion` | `동네 선택하기` | 동네 미선택 상태의 이동 버튼 |

---

## 4. U4 촬영 및 스캔 화면 (`capture.*`)

| 키 (`key`) | 문구 (`value`) | 사용 위치 및 상태 |
|---|---|---|
| `capture.header` | `찍어서 물어보기` | 촬영 화면 상단 제목 |
| `capture.guide` | `버릴 물건 하나를 가운데에 맞춰 주세요` | 프레이밍 가이드 주 안내 문구 (20자) |
| `capture.guideSub` | `라벨이나 재질 표시가 보이면 더 정확해요` | 프레이밍 가이드 보조 문구 (21자) |
| `capture.button.shutter` | `사진 찍기` | 촬영 셔터 버튼 레이블 |
| `capture.button.album` | `앨범에서 고르기` | 갤러리 사진 선택 버튼 |
| `capture.button.askText` | `이름으로 물어보기` | 텍스트 검색 전환 버튼 |
| `capture.scanning.title` | `어떤 물건인지 살펴보고 있어요` | 촬영 직후 스캔 애니메이션 제목 (16자) |
| `capture.scanning.body` | `우리 동네 배출 기준을 함께 찾고 있어요` | 스캔 애니메이션 보조 문구 (21자) |
| `capture.scanning.cancel` | `취소하기` | 분석 대기 중 취소하고 돌아가기 |
| `capture.permission.title` | `카메라 권한이 필요해요` | 카메라 권한 거부/미허용 상태 제목 |
| `capture.permission.body` | `물건을 찍어 확인하려면 카메라 접근을 허용해 주세요.` | 권한 안내 본문 (26자) |
| `capture.permission.sub` | `카메라 없이 앨범 사진이나 이름으로도 물어볼 수 있어요.` | 권한 거부 시 대체 수단 안내 (27자) |
| `capture.permission.allow` | `카메라 권한 허용하기` | 권한 요청 버튼 |
| `capture.permission.settings` | `설정에서 권한 켜기` | OS 설정 이동 버튼 |
| `capture.noRegion` | `먼저 동네를 선택해 주세요.` | 동네 미선택 시 촬영 비활성 안내 |
| `capture.privacy` | `얼굴·주소가 함께 찍히지 않게 해 주세요.` | 촬영 버튼 하단 개인정보 주의 캡션 |
| `capture.one` | `한 번에 한 물건` | 촬영 우측 보조 안내 |
| `capture.preparing` | `카메라를 준비하고 있어요` | 카메라 프리뷰 준비 중 안내 |
| `capture.slow` | `조금 더 확인하고 있어요` | 3초 이상 분석 대기 시 안내 |
| `capture.retry` | `다시 시도` | 촬영 분석 재시도 버튼 |
| `capture.fail` | `결과를 받지 못했어요` | 촬영 분석 요청 실패 제목 |
| `capture.photoFail` | `사진을 처리하지 못했어요. 다시 촬영하거나 앨범에서 골라 주세요.` | 사진 파일 읽기·변환 실패 안내 |

---

## 5. U5 결과 카드 및 되묻기 바텀시트 (`result.*`)

| 키 (`key`) | 문구 (`value`) | 사용 위치 및 상태 |
|---|---|---|
| `result.header` | `배출 방법 안내` | 결과 화면 상단 제목 |
| `result.steps.title` | `이렇게 배출해 주세요` | 배출 순서 체크리스트 섹션 제목 |
| `result.nextDays.title` | `다음 배출 요일` | 동네 배출 요일 및 시간 섹션 제목 |
| `result.nextDays.prefix` | `배출 요일` | 요일 목록 앞 라벨 (`배출 요일: 화, 금`) |
| `result.nextDays.unknown` | `배출 요일 확인 필요` | `next_days=[]`일 때 표시 |
| `result.time.prefix` | `배출 시간` | 시간 앞 라벨 (`배출 시간: 18:00~24:00`) |
| `result.time.unknown` | `배출 시간 확인 필요` | `time=null`일 때 표시 |
| `result.lowConfidence.badge` | `후보` | `confident=false`일 때 품목명 옆 경고 배지 |
| `result.lowConfidence.title` | `정확하지 않을 수 있어요` | 확신 낮음 경고 박스 제목 (13자) |
| `result.lowConfidence.body` | `재질 표시가 보이게 다시 찍거나 이름으로 확인해 주세요.` | 확신 낮음 경고 박스 설명 (27자) |
| `result.lowConfidence.itemSuffix` | `로 보여요` | 받침에 따라 `으로 보여요` / `로 보여요` 결합 |
| `result.lowConfidence.nextDaysNote` | `이 품목이 맞을 때의 배출 요일이에요` | 확신 낮음 상태에서 요일 옆 보조 안내 |
| `result.lowConfidence.retryPhoto` | `다시 찍기` | 확신 낮음 → 촬영 화면 이동 버튼 |
| `result.lowConfidence.askText` | `이름으로 물어보기` | 확신 낮음 → 이름 검색 화면 이동 버튼 |
| `result.unknown.title` | `이 물건은 아직 찾지 못했어요` | `item_key=null` 인식 실패 제목 (16자) |
| `result.unknown.body` | `가까이서 다시 찍거나 품목 이름으로 검색해 보세요.` | 인식 실패 보조 설명 (25자) |
| `result.unknown.retryPhoto` | `다시 찍기` | 인식 실패 → 재촬영 버튼 |
| `result.unknown.askText` | `이름으로 물어보기` | 인식 실패 → 이름 검색 버튼 |
| `result.followUp.open` | `상태 확인하기` | 결과 카드 하단 되묻기 바텀시트 열기 버튼 |
| `result.followUp.sheetTitle` | `상태를 하나만 알려 주세요` | 되묻기 바텀시트 상단 제목 |
| `result.followUp.sheetBody` | `상태에 따라 버리는 방법이 달라져요.` | 되묻기 바텀시트 보조 설명 |
| `result.followUp.has_label` | `라벨이나 스티커가 아직 붙어 있나요?` | `has_label` 되묻기 질문 (서버와 동일) |
| `result.followUp.has_contents` | `안에 내용물이 남아 있나요?` | `has_contents` 되묻기 질문 (서버와 동일) |
| `result.followUp.is_dirty` | `음식물이나 기름이 묻어 있나요?` | `is_dirty` 되묻기 질문 (서버와 동일) |
| `result.followUp.is_coated` | `비닐이나 은박으로 코팅된 종이인가요?` | `is_coated` 되묻기 질문 (서버와 동일) |
| `result.followUp.yes` | `예` | 되묻기 긍정 버튼 |
| `result.followUp.no` | `아니오` | 되묻기 부정 버튼 |
| `result.followUp.loading` | `상태에 맞춰 안내를 바꾸고 있어요` | 되묻기 응답 처리 중 문구 |
| `result.followUp.error` | `답변을 반영하지 못했어요. 다시 눌러 주세요.` | 되묻기 요청 실패 시 기존 결과 유지 + 오류 표시 |
| `result.sources.toggle` | `출처와 기준일 보기` | 출처 아코디언 펼치기 버튼 |
| `result.sources.hide` | `출처 접기` | 출처 아코디언 접기 버튼 |
| `result.sources.prefix` | `출처` | 출처 항목 앞 라벨 |
| `result.sources.updatedPrefix` | `자료 기준` | 기준일 앞 라벨 (`자료 기준 2026-01`) |
| `result.sources.empty` | `출처 정보 확인 필요` | 출처 배열이 비어 있을 때 |

---

## 6. U6 이름으로 물어보기 (`ask.*`)

| 키 (`key`) | 문구 (`value`) | 사용 위치 및 상태 |
|---|---|---|
| `ask.header` | `이름으로 물어보기` | 상단 헤더 제목 |
| `ask.title` | `어떤 물건을 버리시나요?` | 검색창 위 안내 제목 |
| `ask.input.label` | `어떤 물건을 버리나요?` | 입력 필드 상단 고정 라벨 |
| `ask.placeholder` | `예: 투명 페트병, 깨진 유리, 부탄가스` | 검색 입력창 플레이스홀더 |
| `ask.input.hint` | `품목명과 라벨·오염 상태를 함께 적어 주세요.` | 입력창 아래 보조 힌트 |
| `ask.input.errorEmpty` | `버릴 물건 이름을 입력해 주세요.` | 빈 값 제출 시 인라인 오류 문구 |
| `ask.submit` | `물어보기` | 검색 실행 버튼 |
| `ask.clear` | `입력 지우기` | 검색어 초기화 버튼 접근성 라벨 |
| `ask.chips.title` | `자주 묻는 품목` | 20개 추천 품목 칩 섹션 제목 |
| `ask.chips.subtitle` | `품목을 눌러 이름을 입력해 보세요` | 추천 품목 칩 보조 안내 (입력창 채우기 동작 반영) |
| `ask.chips.more` | `더 보기` | 추천 품목 6개 → 20개 전체 펼치기 버튼 |
| `ask.loading` | `배출 방법을 찾고 있어요` | 텍스트 질문 로딩 안내 |
| `ask.noRegion` | `먼저 동네를 선택해 주세요.` | 동네 미선택 시 입력창 비활성 안내 |

---

## 7. U7 상태 및 오류 화면 (`status.*`)

> 서버 `ErrorCode`(`shared/api-types.ts`) 및 네트워크 단절 상태와 1:1로 대응합니다.

| 키 (`key`) | 문구 (`value`) | 대응 조건 / 다음 행동 |
|---|---|---|
| `status.loading.schedule` | `동네 배출 일정을 확인하고 있어요` | `GET /schedule` 대기 중 |
| `status.loading.photo` | `사진으로 품목을 확인하고 있어요` | `POST /ask` (이미지) 대기 중 |
| `status.loading.question` | `배출 방법을 찾고 있어요` | `POST /ask` (텍스트) 대기 중 |
| `status.loading.followup` | `상태에 맞춰 안내를 바꾸고 있어요` | `POST /ask/followup` 대기 중 |
| `status.offline.title` | `인터넷 연결을 확인해 주세요` | `code === "network"` 제목 |
| `status.offline.body` | `네트워크에 연결된 뒤 다시 시도해 주세요.` | `code === "network"` 설명 |
| `status.offline.retry` | `다시 시도하기` | 같은 요청 재시도 버튼 |
| `status.serverError.title` | `잠시 문제가 생겼어요` | 5xx 서버 오류 제목 |
| `status.serverError.body` | `잠시 후 다시 시도하거나 이름으로 물어봐 주세요.` | 5xx 서버 오류 설명 |
| `status.error.invalid_request` | `요청 형식이 올바르지 않아요. 다시 시도해 주세요.` | `422 invalid_request` |
| `status.error.invalid_image` | `사진을 읽지 못했어요. 다시 찍어 주세요.` | `422 invalid_image` → 다시 찍기 |
| `status.error.image_too_large` | `사진이 너무 커요. 다시 찍어 주세요.` | `413 image_too_large` → 다시 찍기 |
| `status.error.region_not_found` | `선택한 동네를 찾지 못했어요. 동네를 다시 골라 주세요.` | `404 region_not_found` → 동네 다시 선택 |
| `status.error.item_not_found` | `품목 정보를 찾지 못했어요. 다시 검색해 주세요.` | `404 item_not_found` |
| `status.error.not_found` | `요청한 화면이나 경로를 찾지 못했어요.` | `404 not_found` |
| `status.error.provider_timeout` | `사진 분석이 오래 걸려요. 다시 시도하거나 이름으로 물어봐 주세요.` | `504 provider_timeout` → 다시 시도 + 이름으로 묻기 |
| `status.error.provider_error` | `사진 분석 서비스에 연결하지 못했어요. 이름으로 물어봐 주세요.` | `502 provider_error` → 이름으로 묻기 |
| `status.error.internal_error` | `서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.` | `500 internal_error` |
| `status.error.network` | `서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.` | 클라이언트 fetch 실패 / 15초 타임아웃 |
| `status.timeout.title` | `확인하는 데 시간이 걸리고 있어요` | 타임아웃 상태 카드 제목 |
| `status.photo.title` | `사진을 확인하지 못했어요` | 사진 오류 상태 카드 제목 |
| `status.region.title` | `동네를 다시 골라 주세요` | 지역 오류 상태 카드 제목 |
| `status.edit` | `입력 수정` | 오류 상태에서 입력 수정으로 복귀 버튼 |

---

## 8. U9 설정 화면 (`settings.*`)

| 키 (`key`) | 문구 (`value`) | 사용 위치 |
|---|---|---|
| `settings.header` | `설정` | 설정 탭 상단 제목 |
| `settings.tagline` | `SaLLiM · 삶을 간단하게` | 설정 하단 브랜드 태그라인 |
| `settings.region.title` | `우리 동네 설정` | 동네 변경 카드 제목 |
| `settings.region.current` | `현재 선택한 동네` | 현재 동네 표시 라벨 |
| `settings.region.change` | `동네 바꾸기` | 동네 변경 버튼 |
| `settings.region.none` | `선택한 동네가 없어요` | 동네 미선택 상태 표시 |
| `settings.region.removed` | `선택한 동네가 지원 목록에 없어요. 동네를 다시 골라 주세요.` | 저장된 동네가 지원 목록에서 사라졌을 때 |
| `settings.theme.title` | `화면 모드` | 라이트/다크 전환 섹션 제목 |
| `settings.theme.system` | `기기 설정 따르기` | 시스템 기본 테마 |
| `settings.theme.light` | `밝은 화면` | 라이트 모드 |
| `settings.theme.dark` | `어두운 화면` | 다크 모드 |
| `settings.theme.saveError` | `화면 모드를 저장하지 못했어요. 이전 설정을 유지했어요.` | 테마 저장 실패 시 인라인 오류 |
| `settings.sources.title` | `데이터 출처 안내` | 데이터 출처 섹션 제목 |
| `settings.sources.body` | `기후에너지환경부 분리배출 지침과 지자체 공식 공지를 바탕으로 안내해요.` | 출처 설명 (34자) |
| `settings.sources.empty` | `출처 정보 확인 필요` | 출처 목록을 불러오지 못했을 때 |
| `settings.disclaimer.title` | `배출 시 유의사항` | 면책 문구 섹션 제목 |
| `settings.disclaimer.body` | `동이나 아파트 단지마다 세부 배출 요일과 시간이 다를 수 있어요. 단지 안내문이나 구청 공지를 함께 확인해 주세요.` | 면책 설명 (두 문장, 각 25자 내외) |
| `settings.privacy.title` | `개인정보 보호 안내` | 개인정보 안내 섹션 제목 |
| `settings.privacy.body` | `사진은 품목을 확인하는 데만 쓰고 서버에 저장하지 않아요. 확인을 위해 AI 분석 서비스로 보내질 수 있어요. 주소나 위치 권한은 받지 않아요.` | 개인정보 안심 문구 (서버 메모리 처리·미저장·제3자 AI 전송 가능성 명시) |
| `settings.version.title` | `앱 버전` | 버전 정보 행 라벨 |
| `settings.contact.title` | `문의 및 정보 수정 제안` | 문의 섹션 제목 |
| `settings.contact.body` | `우리 동네 배출 기준이 바뀌었거나 다른 점이 있다면 알려 주세요.` | 문의 안내 문구 (30자) |
| `settings.contact.pending` | `문의 경로를 준비하고 있어요.` | 문의 기능 오픈 전 안내 |
| `settings.contact.unavailable` | `문의 경로를 준비하고 있어요.` | 문의 연결 불가 시 안내 |

---

## 9. `app/lib/copy.ts` 바로 반영용 객체 스니펫

```ts
export const copy: Record<string, string> = {
  // 공통 · 탭
  "common.appName": "SaLLiM",
  "common.next": "다음",
  "common.prev": "이전",
  "common.skip": "건너뛰기",
  "common.close": "닫기",
  "common.cancel": "취소",
  "common.retry": "다시 시도하기",
  "common.confirm": "확인",
  "common.yes": "예",
  "common.no": "아니오",
  "common.mockNotice": "예시 데이터예요 · 실제 배출 안내가 아니에요",
  "tabs.home": "홈",
  "tabs.capture": "찍기",
  "tabs.ask": "물어보기",
  "tabs.settings": "설정",

  // U2 온보딩 · 동네 선택
  "onboarding.photo.title": "찍으면, 버리는 법이 보여요",
  "onboarding.photo.body": "물건을 찍고 알맞은 배출 방법을 확인해요.",
  "onboarding.method.title": "순서대로, 간단하게",
  "onboarding.method.body": "비우고, 헹구고, 분리하는 순서를 한눈에 봐요.",
  "onboarding.region.title": "우리 동네 기준으로",
  "onboarding.region.body": "사는 동네에 맞는 배출 요일을 확인해요.",
  "onboarding.start": "동네 선택하기",
  "onboarding.stepA11y": "3장 중 {current}장",
  "region.header": "사는 동네 선택",
  "region.title": "사는 동네에 맞게 알려 드릴게요",
  "region.description": "같은 물건도 배출일은 다르니까요.",
  "region.loading": "지원 동네를 불러오고 있어요",
  "region.error": "동네 목록을 불러오지 못했어요",
  "region.empty": "아직 안내할 수 있는 동네가 없어요",
  "region.emptyBody": "동네 데이터를 준비하고 있어요. 잠시 후 다시 확인해 주세요.",
  "region.retry": "다시 불러오기",
  "region.selected": "선택한 동네",
  "region.help": "동·공동주택에 따라 기준이 다를 수 있어요. 상세 주소와 위치 권한은 받지 않아요.",
  "region.confirm": "이 동네로 시작하기",
  "region.pick": "동네를 선택해 주세요",
  "region.saveError": "동네를 저장하지 못했어요. 다시 시도해 주세요.",
  "region.removedNotice": "이전에 선택한 동네를 찾지 못했어요. 동네를 다시 골라 주세요.",

  // U3 홈
  "home.slogan": "삶을 간단하게",
  "home.eyebrow": "오늘의 살림",
  "home.title": "하나씩, 가볍게.",
  "home.today.title": "오늘 내놓는 품목",
  "home.today.label": "오늘은",
  "home.today.daySuffix": "요일",
  "home.today.badgeLabel": "오늘",
  "home.today.more": "외 {count}종",
  "home.today.all": "오늘 배출 품목 모두 보기",
  "home.today.sheetTitle": "오늘 배출할 수 있는 품목",
  "home.today.empty": "안내할 품목이 없어요. 동네 안내를 확인해 주세요.",
  "home.today.timePrefix": "배출 시간",
  "home.today.timeUnknown": "배출 시간 확인 필요",
  "home.action.capture": "찍어서 물어보기",
  "home.action.ask": "이름으로 물어보기",
  "home.week.title": "이번 주 배출 요일",
  "home.week.empty": "안내할 품목이 없어요. 동네 안내를 확인해 주세요.",
  "home.recent.title": "최근 확인한 물건",
  "home.recent.empty": "아직 확인한 물건이 없어요. 사진으로 첫 물건을 확인해 보세요.",
  "home.recent.otherRegion": "다른 동네 기준",
  "home.sources.toggle": "출처 확인하기",
  "home.sources.empty": "출처 정보 확인 필요",
  "home.loading": "동네 배출 일정을 확인하고 있어요",
  "home.refreshing": "최신 안내를 확인하고 있어요",
  "home.offlineCached": "이전 안내예요. 연결 후 다시 확인해 주세요.",
  "home.error": "배출 일정을 불러오지 못했어요",
  "home.noRegion": "먼저 동네를 선택해 주세요.",
  "home.pickRegion": "동네 선택하기",

  // U4 촬영
  "capture.header": "찍어서 물어보기",
  "capture.guide": "버릴 물건 하나를 가운데에 맞춰 주세요",
  "capture.guideSub": "라벨이나 재질 표시가 보이면 더 정확해요",
  "capture.button.shutter": "사진 찍기",
  "capture.button.album": "앨범에서 고르기",
  "capture.button.askText": "이름으로 물어보기",
  "capture.scanning.title": "어떤 물건인지 살펴보고 있어요",
  "capture.scanning.body": "우리 동네 배출 기준을 함께 찾고 있어요",
  "capture.scanning.cancel": "취소하기",
  "capture.permission.title": "카메라 권한이 필요해요",
  "capture.permission.body": "물건을 찍어 확인하려면 카메라 접근을 허용해 주세요.",
  "capture.permission.sub": "카메라 없이 앨범 사진이나 이름으로도 물어볼 수 있어요.",
  "capture.permission.allow": "카메라 권한 허용하기",
  "capture.permission.settings": "설정에서 권한 켜기",
  "capture.noRegion": "먼저 동네를 선택해 주세요.",
  "capture.privacy": "얼굴·주소가 함께 찍히지 않게 해 주세요.",
  "capture.one": "한 번에 한 물건",
  "capture.preparing": "카메라를 준비하고 있어요",
  "capture.slow": "조금 더 확인하고 있어요",
  "capture.retry": "다시 시도",
  "capture.fail": "결과를 받지 못했어요",
  "capture.photoFail": "사진을 처리하지 못했어요. 다시 촬영하거나 앨범에서 골라 주세요.",

  // U5 결과 · 되묻기
  "result.header": "배출 방법 안내",
  "result.steps.title": "이렇게 배출해 주세요",
  "result.nextDays.title": "다음 배출 요일",
  "result.nextDays.prefix": "배출 요일",
  "result.nextDays.unknown": "배출 요일 확인 필요",
  "result.time.prefix": "배출 시간",
  "result.time.unknown": "배출 시간 확인 필요",
  "result.lowConfidence.badge": "후보",
  "result.lowConfidence.title": "정확하지 않을 수 있어요",
  "result.lowConfidence.body": "재질 표시가 보이게 다시 찍거나 이름으로 확인해 주세요.",
  "result.lowConfidence.itemSuffix": "로 보여요",
  "result.lowConfidence.nextDaysNote": "이 품목이 맞을 때의 배출 요일이에요",
  "result.lowConfidence.retryPhoto": "다시 찍기",
  "result.lowConfidence.askText": "이름으로 물어보기",
  "result.unknown.title": "이 물건은 아직 찾지 못했어요",
  "result.unknown.body": "가까이서 다시 찍거나 품목 이름으로 검색해 보세요.",
  "result.unknown.retryPhoto": "다시 찍기",
  "result.unknown.askText": "이름으로 물어보기",
  "result.followUp.open": "상태 확인하기",
  "result.followUp.sheetTitle": "상태를 하나만 알려 주세요",
  "result.followUp.sheetBody": "상태에 따라 버리는 방법이 달라져요.",
  "result.followUp.has_label": "라벨이나 스티커가 아직 붙어 있나요?",
  "result.followUp.has_contents": "안에 내용물이 남아 있나요?",
  "result.followUp.is_dirty": "음식물이나 기름이 묻어 있나요?",
  "result.followUp.is_coated": "비닐이나 은박으로 코팅된 종이인가요?",
  "result.followUp.yes": "예",
  "result.followUp.no": "아니오",
  "result.followUp.loading": "상태에 맞춰 안내를 바꾸고 있어요",
  "result.followUp.error": "답변을 반영하지 못했어요. 다시 눌러 주세요.",
  "result.sources.toggle": "출처와 기준일 보기",
  "result.sources.hide": "출처 접기",
  "result.sources.prefix": "출처",
  "result.sources.updatedPrefix": "자료 기준",
  "result.sources.empty": "출처 정보 확인 필요",

  // U6 이름으로 물어보기
  "ask.header": "이름으로 물어보기",
  "ask.title": "어떤 물건을 버리시나요?",
  "ask.input.label": "어떤 물건을 버리나요?",
  "ask.placeholder": "예: 투명 페트병, 깨진 유리, 부탄가스",
  "ask.input.hint": "품목명과 라벨·오염 상태를 함께 적어 주세요.",
  "ask.input.errorEmpty": "버릴 물건 이름을 입력해 주세요.",
  "ask.submit": "물어보기",
  "ask.clear": "입력 지우기",
  "ask.chips.title": "자주 묻는 품목",
  "ask.chips.subtitle": "품목을 눌러 이름을 입력해 보세요",
  "ask.chips.more": "더 보기",
  "ask.loading": "배출 방법을 찾고 있어요",
  "ask.noRegion": "먼저 동네를 선택해 주세요.",

  // U7 상태 · 오류 (ErrorCode 매핑)
  "status.loading.schedule": "동네 배출 일정을 확인하고 있어요",
  "status.loading.photo": "사진으로 품목을 확인하고 있어요",
  "status.loading.question": "배출 방법을 찾고 있어요",
  "status.loading.followup": "상태에 맞춰 안내를 바꾸고 있어요",
  "status.offline.title": "인터넷 연결을 확인해 주세요",
  "status.offline.body": "네트워크에 연결된 뒤 다시 시도해 주세요.",
  "status.offline.retry": "다시 시도하기",
  "status.serverError.title": "잠시 문제가 생겼어요",
  "status.serverError.body": "잠시 후 다시 시도하거나 이름으로 물어봐 주세요.",
  "status.error.invalid_request": "요청 형식이 올바르지 않아요. 다시 시도해 주세요.",
  "status.error.invalid_image": "사진을 읽지 못했어요. 다시 찍어 주세요.",
  "status.error.image_too_large": "사진이 너무 커요. 다시 찍어 주세요.",
  "status.error.region_not_found": "선택한 동네를 찾지 못했어요. 동네를 다시 골라 주세요.",
  "status.error.item_not_found": "품목 정보를 찾지 못했어요. 다시 검색해 주세요.",
  "status.error.not_found": "요청한 화면이나 경로를 찾지 못했어요.",
  "status.error.provider_timeout": "사진 분석이 오래 걸려요. 다시 시도하거나 이름으로 물어봐 주세요.",
  "status.error.provider_error": "사진 분석 서비스에 연결하지 못했어요. 이름으로 물어봐 주세요.",
  "status.error.internal_error": "서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.",
  "status.error.network": "서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.",
  "status.timeout.title": "확인하는 데 시간이 걸리고 있어요",
  "status.photo.title": "사진을 확인하지 못했어요",
  "status.region.title": "동네를 다시 골라 주세요",
  "status.edit": "입력 수정",

  // U9 설정
  "settings.header": "설정",
  "settings.tagline": "SaLLiM · 삶을 간단하게",
  "settings.region.title": "우리 동네 설정",
  "settings.region.current": "현재 선택한 동네",
  "settings.region.change": "동네 바꾸기",
  "settings.region.none": "선택한 동네가 없어요",
  "settings.region.removed": "선택한 동네가 지원 목록에 없어요. 동네를 다시 골라 주세요.",
  "settings.theme.title": "화면 모드",
  "settings.theme.system": "기기 설정 따르기",
  "settings.theme.light": "밝은 화면",
  "settings.theme.dark": "어두운 화면",
  "settings.theme.saveError": "화면 모드를 저장하지 못했어요. 이전 설정을 유지했어요.",
  "settings.sources.title": "데이터 출처 안내",
  "settings.sources.body": "기후에너지환경부 분리배출 지침과 지자체 공식 공지를 바탕으로 안내해요.",
  "settings.sources.empty": "출처 정보 확인 필요",
  "settings.disclaimer.title": "배출 시 유의사항",
  "settings.disclaimer.body": "동이나 아파트 단지마다 세부 배출 요일과 시간이 다를 수 있어요. 단지 안내문이나 구청 공지를 함께 확인해 주세요.",
  "settings.privacy.title": "개인정보 보호 안내",
  "settings.privacy.body": "사진은 품목을 확인하는 데만 쓰고 서버에 저장하지 않아요. 확인을 위해 AI 분석 서비스로 보내질 수 있어요. 주소나 위치 권한은 받지 않아요.",
  "settings.version.title": "앱 버전",
  "settings.contact.title": "문의 및 정보 수정 제안",
  "settings.contact.body": "우리 동네 배출 기준이 바뀌었거나 다른 점이 있다면 알려 주세요.",
  "settings.contact.pending": "문의 경로를 준비하고 있어요.",
  "settings.contact.unavailable": "문의 경로를 준비하고 있어요.",
};
```
