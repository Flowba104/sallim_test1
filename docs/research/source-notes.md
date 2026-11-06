# 출처 URL 검증 및 루트 URL 기록 (source-notes.md)

`data/items.json` 및 `data/regions/seoul-gwanak.json`에 수록된 공식 출처 URL의 검증 내역과, 세부 딥링크 대신 도메인 루트 URL을 병기한 항목을 정리합니다.

## 1. 세부 페이지(딥링크)까지 직접 확인된 법령·행정규칙 URL

| 출처 제목 | 확인된 세부 URL | 기준일 (`updated`) | 검증 내용 |
|---|---|---|---|
| **기후에너지환경부 재활용가능자원의 분리수거 등에 관한 지침 [별표 1] (훈령 제18호)** | `https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000213032` | `2026-01` | 법제처 국가법령정보센터 행정규칙 고유번호(`admRulSeq=2100000213032`) 확인 완료. 소관부처: 기후에너지환경부(생활폐기물과), 기후에너지환경부훈령 제18호(2026. 1. 1. 일부개정·시행). [별표 1] 품목별 분리배출 요령 수록. |
| **찾기쉬운 생활법령정보 — 자원재활용(재활용품 분리배출 요령)** | `https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1452&ccmSeq=7` | `2026-01` | 법제처 찾기쉬운 생활법령정보 '자원재활용'(`csmSeq=1452`) 내 품목별 재활용 분리배출 요령(`ccmSeq=7`) 세부 페이지 확인 완료. |
| **찾기쉬운 생활법령정보 — 아파트 생활(생활폐기물 분리배출)** | `https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=559&ccmSeq=3` | `2026-01` | 법제처 찾기쉬운 생활법령정보 '아파트 생활'(`csmSeq=559`) 내 생활폐기물·음식물쓰레기 배출 방법(`ccmSeq=3`) 세부 페이지 확인 완료. |

> **조치 완료:** `data/items.json`의 전체 67개 품목 모두 위 3개의 세부 법령·법제처 딥링크 중 최소 1개 이상을 제1출처로 포함하도록 보강했습니다.

## 2. 루트 URL만 확인하여 유지·병기한 출처 목록 (리스크 관리용)

아래 누리집은 사이트 구조상 품목별 고정 정적 URL이 없거나(통합검색·SPA 방식), 메뉴 개편 시 파라미터(`pageId` 등)가 바뀌어 깨진 링크(404) 위험이 있어 공식 도메인 루트 URL을 표기했습니다.

| 도메인 (루트 URL) | 출처 제목 | 사용 파일 및 건수 | 루트 URL 유지 사유 |
|---|---|---|---|
| `https://www.wasteguide.or.kr` | 환경부·한국환경공단 내 손안의 분리배출 (생활폐기물 분리배출 누리집, `분리배출.kr` 동일) | `data/items.json` (보조 출처로 41개 품목에 병기) | 730여 개 품목사전이 내부 검색 파라미터로 동작하여 개별 품목 고정 URL을 단정하지 않고 공식 포털 루트 URL을 병기함 (모든 해당 품목에는 `law.go.kr` 또는 `easylaw.go.kr` 딥링크가 함께 들어 있음). |
| `https://www.gwanak.go.kr` | 서울특별시 관악구청 청소행정과 생활폐기물·재활용품 배출안내 | `data/regions/seoul-gwanak.json` (`sources` 1건, `drop_off_points` 4건) | 관악구청 홈페이지 내 청소행정과 안내 페이지의 세부 `pageId` 쿼리스트링을 추측하지 않고 공식 루트 도메인으로 표기함. |
| `https://smartclean.gwanak.go.kr` | 스마트클린 관악 — 대형폐기물 및 생활폐기물 배출 안내 | `data/regions/seoul-gwanak.json` (`sources` 1건, `drop_off_points` 1건) | 관악구 대형폐기물 온라인 신청 전용 서브도메인 루트가 곧 서비스 진입 페이지임. |
| `https://www.15990903.or.kr` | 환경부·e-순환거버넌스 폐가전제품 무상방문수거 안내 | `data/items.json` (`small_appliance`, `large_appliance`), `data/regions/seoul-gwanak.json` (`drop_off_points` 1건) | 폐가전 무상방문수거 공식 예약 포털의 대표 진입 URL임. |

## 3. R2 데이터 최종 검수 및 수정 내역 (2026-11-06)

- **스키마 및 출처 전수 검증 (`data/items.json` 67개 품목, `data/regions/seoul-gwanak.json`):**
  - 12개 허용 `category`(`투명페트`, `플라스틱`, `종이`, `종이팩`, `캔·고철`, `유리병`, `비닐`, `스티로폼`, `일반쓰레기`, `음식물`, `전용수거`, `대형폐기물`) 및 4대 `conditions` 키(`has_label`, `has_contents`, `is_dirty`, `is_coated`) 스키마 위반 0건 확인.
  - 67개 전 품목에 공식 법령·생활법령 딥링크(`law.go.kr` 57건, `easylaw.go.kr` 16건)가 최소 1개 이상 포함되어 있으며, 품목 내 중복 URL이나 깨진 형식 0건 확인.
- **품목 간 별칭(`aliases`) 충돌·오매칭 및 누락 별칭 보정:**
  - `milk_carton`(살균팩) ↔ `aseptic_carton`(멸균팩): `"두유팩"`이 `milk_carton.aliases`에 들어 있어 두유팩 검색 시 살균팩으로 매칭되던 문제를 수정하여 `"두유팩"`을 `aseptic_carton.aliases`로 이동하고, `milk_carton`에는 `"흰우유팩"`, `"냉장우유팩"`, `aseptic_carton`에는 `"멸균우유팩"`, `"벽돌팩"`을 보강함.
  - `glass_bottle`: 품목명 괄호 예시의 `"음료수병"`(`pet_bottle_clear`의 별칭과 혼동)을 `"와인병"`으로 정비(`"유리병 (소주병·맥주병·와인병·잼병)"`).
  - `cat_litter`: 품목명 괄호 예시의 단독 `"실리카겔"`(`silica_gel_desiccant` 별칭과 혼동)을 `"실리카겔 모래"`로 명확화하고 `"벤토나이트"`, `"카사바모래"`, `"실리카겔모래"` 별칭을 추가함.
  - 자연어 검색 매칭(`match_text`) 보강: `cardboard_box`(`"종이상자"`, `"골판지상자"`), `shampoo_pump_bottle`(`"샴푸용기"`, `"손세정제통"`), `aluminum_can`(`"음료수캔"`, `"사이다캔"`, `"캔음료"`), `butane_gas_can`(`"살충제"`, `"부탄가스통"`, `"에어로졸캔"`), `ceramic_dish`(`"화분"`, `"도자기그릇"`, `"밥그릇"`, `"국그릇"`), `styrofoam_box`(`"완충재"`, `"보냉상자"`, `"보냉박스"`), `styrofoam_tray`(`"식품트레이"`, `"고기트레이"`, `"스티로폼받침대"`), `coated_paper`(`"코팅지"`, `"포장지"`), `cling_wrap`(`"배달랩"`, `"음식랩"`), `cosmetic_glass_bottle`(`"화장품유리병"`, `"화장품유리용기"`, `"앰플병"`), `plastic_hanger`(`"원목옷걸이"`, `"바지옷걸이"`, `"복합옷걸이"`), `capsule_coffee`(`"알루미늄캡슐"`, `"플라스틱캡슐"`, `"원두캡슐"`), `insulated_cooler_bag`(`"보냉파우치"`, `"은박봉투"`), `stationery_pen`(`"문구류"`, `"필기구"`, `"색연필"`) 별칭 추가 후 전 항목 `test_real_data.py` 교차 중복 0건 검증 통과.
- **문구 톤앤매너 정비 (`steps`, `conditions`):**
  - `pet_bottle_clear`, `plastic_bottle_colored`, `cardboard_box`, `aluminum_can`, `glass_bottle`, `styrofoam_box` 내 강압적 표현(`투입 금지`, `반드시 떼어내야 해요`)을 안내형 문구(`수거함에 넣지 않기`, `떼어내어 따로 버려 주세요`)로 다듬음.
