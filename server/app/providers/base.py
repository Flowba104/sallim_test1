"""VLM 프로바이더 인터페이스. VLM은 '뭔지'만 고른다 — 배출법은 data/가 답한다."""
import json
import re
from dataclasses import dataclass, field

from ..schemas import Item, ItemState


@dataclass
class Classification:
    item_key: str | None          # items의 key 중 하나, 모르면 None
    confidence: float = 0.0       # 0~1
    state: ItemState = field(default_factory=ItemState)  # 판단 못 한 상태는 None


class VisionProvider:
    name = "base"

    def classify(self, image: bytes, items: dict[str, Item]) -> Classification:
        raise NotImplementedError

    def match_text(self, question: str, items: dict[str, Item]) -> Classification:
        raise NotImplementedError


# 상태·혼동 규칙: docs/research/vlm-hints.md (researcher R6) 반영
STATE_GUIDE = (
    "has_label: 라벨/스티커/테이프가 붙어 있음, "
    "has_contents: 내용물/액체/가스가 남아 있음, "
    "is_dirty: 음식물·고추기름·이물질로 오염됨, "
    "is_coated: 비닐·은박 코팅된 종이. "
    "사진에서 눈으로 확실히 보일 때만 true/false. 불투명 용기 내부(캔·종이팩·튜브)나 "
    "가려진 면처럼 사진만으로 알 수 없으면 반드시 null (추측 금지 — null이면 사용자에게 되묻는다)."
)

DISAMBIGUATION_GUIDE = (
    "구분 주의: "
    "(1) 무색 투명 음료병만 pet_bottle_clear. 유색 페트병(plastic_bottle_colored)이나 입구가 넓은 "
    "테이크아웃 컵(plastic_cup_takeout)은 아니다. "
    "(2) 붉은 라면 기름 자국이나 은박 뚜껑 테두리가 있는 컵은 paper_cup이 아니라 cup_ramen. "
    "(3) 깨진 유리·거울·내열유리(broken_glass)와 불투명 도자기(ceramic_dish)는 glass_bottle이 아니다. "
    "(4) 계란껍데기(eggshell), 뼈·생선가시(animal_bone), 조개·견과류 껍데기·단단한 씨(shellfish_nut_shell), "
    "양파·마늘 마른 껍질·파뿌리·티백(onion_garlic_peel)은 food_waste가 아니다. "
    "(5) 솜이불·베개·방석(duvet_blanket)과 바퀴 달린 캐리어(furniture_large)는 clothing이 아니다. "
    "두 품목 사이에서 애매하면 confidence를 0.6 미만으로. 여러 물건이 있으면 가운데 가장 크게 찍힌 것 하나."
)


def _item_lines(items: dict[str, Item]) -> str:
    return "\n".join(f"- {k}: {it.name}" + (f" — {it.visual_hint}" if it.visual_hint else "")
                     for k, it in items.items())


def build_prompt(items: dict[str, Item], question: str | None = None) -> str:
    task = (f'사용자 질문: "{question}"\n질문이 가리키는 품목을 고르세요.' if question
            else "사진 속 주된 버릴 물건 하나를 고르세요.")
    return (
        "당신은 분리배출 품목 분류기입니다. 배출 방법은 말하지 말고 품목만 고릅니다.\n"
        f"{task}\n아래 목록의 key 중에서만 고르고, 목록에 없거나 확실하지 않으면 \"unknown\".\n\n"
        f"품목 목록:\n{_item_lines(items)}\n\n"
        f"{DISAMBIGUATION_GUIDE}\n\n"
        f"상태: {STATE_GUIDE}\n\n"
        'JSON 하나만 출력: {"item_key": "<key 또는 unknown>", "confidence": 0~1, '
        '"state": {"has_label": true|false|null, "has_contents": ..., "is_dirty": ..., "is_coated": ...}}'
    )


def parse_response(text: str, items: dict[str, Item]) -> Classification:
    """모델 출력 → Classification. 목록 밖 key나 깨진 JSON은 unknown."""
    m = re.search(r"\{.*\}", text, re.S)
    try:
        data = json.loads(m.group(0)) if m else {}
    except json.JSONDecodeError:
        data = {}
    key = data.get("item_key")
    if key not in items:
        return Classification(None, 0.0)
    try:
        conf = min(max(float(data.get("confidence", 0)), 0.0), 1.0)
    except (TypeError, ValueError):
        conf = 0.0
    raw_state = data.get("state") if isinstance(data.get("state"), dict) else {}
    state = ItemState(**{k: v for k, v in raw_state.items()
                         if k in ItemState.model_fields and isinstance(v, bool)})
    return Classification(key, conf, state)
