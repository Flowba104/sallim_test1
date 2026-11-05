"""답변 조립 — 템플릿만. 배출법은 data/의 문장 그대로, LLM이 지어내지 않는다."""
from .schemas import WEEKDAYS, AskResponse, FollowUp, Item, ItemState, RegionData, Source

CONFIDENCE_MIN = 0.6
RETRY_MSG = "다시 찍거나 이름으로 물어봐 주세요."

FOLLOW_UP_QUESTIONS = {
    "has_label": "라벨이나 스티커가 아직 붙어 있나요?",
    "has_contents": "안에 내용물이 남아 있나요?",
    "is_dirty": "음식물이나 기름이 묻어 있나요?",
    "is_coated": "비닐이나 은박으로 코팅된 종이인가요?",
}


def _batchim(word: str) -> int:
    """마지막 글자 받침 번호 (0=없음). 한글이 아니면 0으로 본다."""
    c = word.strip()[-1:] or " "
    return (ord(c) - 0xAC00) % 28 if "가" <= c <= "힣" else 0


def eun(word: str) -> str:
    return word + ("은" if _batchim(word) else "는")


def euro(word: str) -> str:
    return word + ("으로" if _batchim(word) not in (0, 8) else "로")  # 8 = ㄹ받침


def unknown_response() -> AskResponse:
    return AskResponse(
        item_key=None, item_name=None, category=None,
        answer=f"무엇인지 확실하지 않아요. {RETRY_MSG}",
        steps=[], next_days=[], time=None, confident=False, follow_up=None, sources=[],
    )


def _dedupe(sources: list[Source]) -> list[Source]:
    seen, out = set(), []
    for s in sources:
        if s.url not in seen:
            seen.add(s.url)
            out.append(s)
    return out


def next_days(region: RegionData, category: str) -> list[str]:
    return [d for d in WEEKDAYS if category in region.week.get(d, [])]


def assemble(item_key: str, item: Item, region: RegionData,
             state: ItemState | None = None, confidence: float = 1.0) -> AskResponse:
    state = state or ItemState()
    confident = confidence >= CONFIDENCE_MIN
    steps = list(item.steps)

    # 상태가 True인 조건만 안내에 붙인다. 모르는(None) 조건은 하나 되묻는다.
    notes = [text for key, text in item.conditions.items() if getattr(state, key) is True]
    unknown = [key for key in item.conditions if getattr(state, key) is None]
    follow_up = (FollowUp(key=unknown[0], question=FOLLOW_UP_QUESTIONS[unknown[0]])
                 if confident and unknown else None)

    override = region.overrides.get(item_key)
    days = next_days(region, item.category)
    if override:
        answer = f"{item.name}: {region.name}에서는 {override}"
        steps.insert(0, override)
    else:
        answer = f"{eun(item.name)} {euro(item.category)} 버려요."
        if days:
            answer += f" {eun(region.name)} {'·'.join(days)}요일" + (f" {region.time}" if region.time else "") + "에 내놓아요."
    if notes:
        answer += " " + " ".join(notes)
    if not confident:
        answer = f"아마 {item.name} 같아요. 확실하지 않으니 {RETRY_MSG}"

    return AskResponse(
        item_key=item_key, item_name=item.name, category=item.category,
        answer=answer, steps=steps + notes, next_days=days,
        time=region.time if days else None,
        confident=confident, follow_up=follow_up,
        sources=_dedupe([*item.sources, *region.sources]),
        note=region.note if days else None,
    )
