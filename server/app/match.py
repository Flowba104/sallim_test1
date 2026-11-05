"""텍스트 질문 → item_key. 이름/별칭 매칭 (LLM 전에)."""
import re

from .schemas import Item


def normalize(s: str) -> str:
    return re.sub(r"[\s\W_]+", "", s.lower())


def match_text(question: str, items: dict[str, Item]) -> str | None:
    """정확히 같으면 그 품목, 아니면 질문에 들어 있는 가장 긴 이름/별칭.
    가장 긴 후보가 여러 품목에 걸치면 모호하므로 None (→ 프로바이더 fallback)."""
    q = normalize(question)
    if not q:
        return None
    best_len, best = 0, set()
    for key, it in items.items():
        for term in (normalize(t) for t in [it.name, *it.aliases]):
            if len(term) < 2:
                continue  # 한 글자 별칭은 오매칭 위험
            if term == q:
                return key
            if term in q:
                if len(term) > best_len:
                    best_len, best = len(term), {key}
                elif len(term) == best_len:
                    best.add(key)
    return best.pop() if len(best) == 1 else None
