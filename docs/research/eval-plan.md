# VLM 실물 촬영 평가 계획 및 30개 테스트 품목 명세 (`eval-plan.md`)

> **작성 목적:** `server/eval/run_eval.py` (`cd server && .venv/bin/python -m eval.run_eval --data-dir ../data`)에서 실제 스마트폰 촬영 이미지로 VLM의 **품목 분류 정답률**, **혼동 쌍(Confusion Pair) 변별력**, **목록 밖 물건(`unknown`) 기각 능력**, **상태(`ItemState`) 되묻기 트리거**를 검증하기 위한 30개 표준 테스트셋 명세입니다.

---

## 1. 테스트셋 설계 기준 (총 30장)

- **12개 카테고리 전수 커버:** `투명페트`, `플라스틱`, `종이`, `종이팩`, `캔·고철`, `유리병`, `비닐`, `스티로폼`, `일반쓰레기`, `음식물`, `전용수거`, `대형폐기물` 모두 포함
- **VLM 다빈도 혼동 쌍(`docs/research/vlm-hints.md`) 집중 검증:**
  - 무색 페트병(`pet_bottle_clear`) vs 유색 페트병(`plastic_bottle_colored`) vs 테이크아웃 컵(`plastic_cup_takeout`)
  - 일반 종이컵(`paper_cup`) vs 컵라면 용기(`cup_ramen`)
  - 살균 우유팩(`milk_carton`) vs 멸균팩(`aseptic_carton`)
  - 일반 종이(`newspaper_book`) vs 감열지 영수증(`receipt`) vs 코팅 전단지(`coated_paper`)
  - 온전한 유리병(`glass_bottle`) vs 깨진 유리(`broken_glass`) vs 도자기 그릇(`ceramic_dish`)
  - 음식물쓰레기(`food_waste`) vs 계란껍데기(`eggshell`)·치킨뼈(`animal_bone`)·양파껍질(`onion_garlic_peel`)
- **목록 밖 물건(`unknown`) 기각 테스트 2장 포함:** 배출 대상이 아닌 반려동물·손·노트북 화면 등을 찍었을 때 억지로 품목을 고르지 않고 `unknown`을 반환하는지 검증

---

## 2. `server/eval/` 촬영 대상 30개 목록 및 정답 `item_key`

| # | 파일명 (`server/eval/images/`) | 정답 `item_key` | 카테고리 | 찍을 실물 물건 및 촬영 조건 | 주요 검증 포인트 (혼동 대상 / 기대 `ItemState`) |
|---|---|---|---|---|---|
| 01 | `01_pet_clear_labeled.jpg` | `pet_bottle_clear` | 투명페트 | 비닐 라벨이 붙어 있는 무색 투명 생수병 (500mL/2L) | `plastic_bottle_colored`와 구분, `has_label: true` 감지 |
| 02 | `02_pet_colored_beer.jpg` | `plastic_bottle_colored` | 플라스틱 | 갈색 맥주 페트병 또는 초록색 탄산·소주 페트병 | `pet_bottle_clear`로 오분류하지 않는지 검증 |
| 03 | `03_takeout_ice_cup.jpg` | `plastic_cup_takeout` | 플라스틱 | 카페 로고가 찍힌 투명 아이스커피 플라스틱 컵 (돔 뚜껑 장착) | 투명하지만 병이 아니므로 `pet_bottle_clear`가 아닌 `플라스틱` 판별 |
| 04 | `04_delivery_container_dirty.jpg` | `plastic_container` | 플라스틱 | 붉은 떡볶이·김치 국물이 묻은 흰색/검정 배달 플라스틱 용기 | `styrofoam_tray`와 구분, `is_dirty: true` 감지 |
| 05 | `05_shampoo_pump.jpg` | `shampoo_pump_bottle` | 플라스틱 | 누르는 펌프 헤드가 달린 불투명 샴푸·바디워시 통 | 불투명 용기이므로 `has_contents: null` (되묻기 유도) |
| 06 | `06_egg_tray_plastic.jpg` | `egg_tray_plastic` | 플라스틱 | 투명 성형 플라스틱 10구/15구 계란 케이스 | 종이 계란판(`egg_tray_paper`)과 재질 구분 |
| 07 | `07_cardboard_box_taped.jpg` | `cardboard_box` | 종이 | 박스테이프와 운송장 스티커가 붙은 갈색 골판지 택배 상자 | `has_label: true` 감지 |
| 08 | `08_egg_tray_paper.jpg` | `egg_tray_paper` | 종이 | 회백색·갈색 거친 펄프 재질의 30구 종이 계란판 | 플라스틱 계란판(`egg_tray_plastic`)과 구분 |
| 09 | `09_receipt_thermal.jpg` | `receipt` | 일반쓰레기 | 마트·식당에서 받은 영수증 (감열지) | `newspaper_book`(종이)으로 오분류하지 않는지 검증 |
| 10 | `10_coated_flyer.jpg` | `coated_paper` | 일반쓰레기 | 빛이 반사되는 유광 비닐 코팅 광고 전단지 | `newspaper_book`(종이)과 구분 |
| 11 | `11_milk_carton_gable.jpg` | `milk_carton` | 종이팩 | 상단이 지붕 모양(박공형)인 흰 우유팩 (200mL/1000mL) | 일반 `종이`가 아닌 `종이팩` 분류, `has_contents: null` |
| 12 | `12_aseptic_soy_carton.jpg` | `aseptic_carton` | 종이팩 | 직육면체 벽돌 모양의 두유·주스 멸균팩 (빨대 부착 또는 은박 단면) | `milk_carton` 및 일반 `종이`와 구분 |
| 13 | `13_paper_cup_clean.jpg` | `paper_cup` | 종이팩 | 자판기·사무실용 일회용 무지/인쇄 종이컵 | `cup_ramen`과 구분 |
| 14 | `14_cup_ramen_stained.jpg` | `cup_ramen` | 일반쓰레기 | 라면 국물 자국이 남은 종이·스티로폼 컵라면 용기 | `paper_cup`/`styrofoam_box`로 오분류하지 않는지 검증 |
| 15 | `15_aluminum_can_beverage.jpg` | `aluminum_can` | 캔·고철 | 콜라·맥주 알루미늄 음료 캔 | `has_contents: null` (되묻기 유도) |
| 16 | `16_butane_gas_can.jpg` | `butane_gas_can` | 캔·고철 | 휴대용 부탄가스 캔 또는 살충제 스프레이 캔 | 일반 음료 캔과 구분 및 가스 잔류(`has_contents`) 되묻기 검증 |
| 17 | `17_aluminum_foil_crumpled.jpg` | `aluminum_foil` | 일반쓰레기 | 뭉쳐 놓은 은박 쿠킹호일 조각 | 금속 광택이나 `aluminum_can`(캔·고철)이 아닌 일반쓰레기 판별 |
| 18 | `18_glass_bottle_soju.jpg` | `glass_bottle` | 유리병 | 깨지지 않은 초록색 소주병·갈색 맥주병·투명 잼병 | `plastic_bottle_colored` 및 `broken_glass`와 구분 |
| 19 | `19_broken_glass_cup.jpg` | `broken_glass` | 일반쓰레기 | 깨진 유리컵 조각 또는 손거울·냄비 내열유리 뚜껑 | `glass_bottle`(유리병)로 오분류하지 않는지 검증 |
| 20 | `20_ceramic_mug_bowl.jpg` | `ceramic_dish` | 일반쓰레기 | 불투명 도자기 머그컵·사기 밥그릇·검은 뚝배기 | `glass_bottle`과 구분 |
| 21 | `21_snack_wrapper_bag.jpg` | `snack_ramen_wrapper` | 비닐 | 안쪽이 은색 증착된 과자봉지 또는 라면봉지 | `insulated_cooler_bag`와 구분 |
| 22 | `22_cling_wrap_film.jpg` | `cling_wrap` | 일반쓰레기 | 그릇에서 떼어낸 얇고 끈적한 투명 식품 포장용 랩 | 일반 `plastic_bag`(비닐)로 오분류하지 않는지 검증 |
| 23 | `23_styrofoam_box.jpg` | `styrofoam_box` | 스티로폼 | 흰색 스티로폼 택배 보냉 상자 | 테이프 부착 여부(`has_label`) 감지 |
| 24 | `24_toothbrush_used.jpg` | `toothbrush` | 일반쓰레기 | 플라스틱 손잡이에 칫솔모가 박힌 칫솔 | 복합재질이므로 `플라스틱`이 아닌 `일반쓰레기` 판별 |
| 25 | `25_ice_pack_gel.jpg` | `ice_pack` | 일반쓰레기 | 고흡수성수지(젤) 보냉 아이스팩 파우치 | `plastic_bag`(비닐)과 구분 |
| 26 | `26_eggshell_pieces.jpg` | `eggshell` | 일반쓰레기 | 깨진 달걀 껍데기 | `food_waste`(음식물)로 오분류하지 않는지 검증 |
| 27 | `27_chicken_bones.jpg` | `animal_bone` | 일반쓰레기 | 먹고 남은 치킨 뼈 또는 돼지갈비 뼈 | `food_waste`(음식물)로 오분류하지 않는지 검증 |
| 28 | `28_food_waste_peel.jpg` | `food_waste` | 음식물 | 귤 껍질·바나나 껍질·사과 껍질 | 일반쓰레기 껍질류(`onion_garlic_peel`, `shellfish_nut_shell`)와 구분 |
| 29 | `29_aa_batteries.jpg` | `battery` | 전용수거 | 다 쓴 AA/AAA 건전지 또는 보조배터리 | `캔·고철`이나 `일반쓰레기`가 아닌 `전용수거` 판별 |
| 30 | `30_unknown_laptop_hand.jpg` | `unknown` | — (기각) | 책상 위 노트북 키보드·사람 손 등 분리배출 품목이 아닌 사진 | 억지 매칭 없이 `unknown` 반환 검증 |

---

## 3. `server/eval/labels.csv` 바로 적용 가능한 CSV 포맷

실물 이미지 30장을 `server/eval/images/`에 넣을 때 아래 내용을 `labels.csv`로 저장해 사용할 수 있습니다.

```csv
filename,item_key
01_pet_clear_labeled.jpg,pet_bottle_clear
02_pet_colored_beer.jpg,plastic_bottle_colored
03_takeout_ice_cup.jpg,plastic_cup_takeout
04_delivery_container_dirty.jpg,plastic_container
05_shampoo_pump.jpg,shampoo_pump_bottle
06_egg_tray_plastic.jpg,egg_tray_plastic
07_cardboard_box_taped.jpg,cardboard_box
08_egg_tray_paper.jpg,egg_tray_paper
09_receipt_thermal.jpg,receipt
10_coated_flyer.jpg,coated_paper
11_milk_carton_gable.jpg,milk_carton
12_aseptic_soy_carton.jpg,aseptic_carton
13_paper_cup_clean.jpg,paper_cup
14_cup_ramen_stained.jpg,cup_ramen
15_aluminum_can_beverage.jpg,aluminum_can
16_butane_gas_can.jpg,butane_gas_can
17_aluminum_foil_crumpled.jpg,aluminum_foil
18_glass_bottle_soju.jpg,glass_bottle
19_broken_glass_cup.jpg,broken_glass
20_ceramic_mug_bowl.jpg,ceramic_dish
21_snack_wrapper_bag.jpg,snack_ramen_wrapper
22_cling_wrap_film.jpg,cling_wrap
23_styrofoam_box.jpg,styrofoam_box
24_toothbrush_used.jpg,toothbrush
25_ice_pack_gel.jpg,ice_pack
26_eggshell_pieces.jpg,eggshell
27_chicken_bones.jpg,animal_bone
28_food_waste_peel.jpg,food_waste
29_aa_batteries.jpg,battery
30_unknown_laptop_hand.jpg,unknown
```

---

## 4. 정답 키 유효성 검증

위 29개 품목 키(`01`~`29`)는 모두 `data/items.json`에 존재하는 `item_key`와 100% 일치하며, `30`번(`unknown`)은 `server/eval/run_eval.py`의 목록 밖 기각 테스트 규약을 따릅니다.
