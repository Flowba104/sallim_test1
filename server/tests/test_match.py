from app import data
from app.match import match_text
from tests.conftest import FIXTURES

ITEMS = data.load(FIXTURES).items


def test_exact_and_alias():
    assert match_text("투명 페트병", ITEMS) == "pet_bottle_clear"
    assert match_text("생수병", ITEMS) == "pet_bottle_clear"


def test_contained_in_sentence():
    assert match_text("소주병은 어떻게 버려요?", ITEMS) == "glass_bottle"
    assert match_text("다 쓴 건전지 버리는 법", ITEMS) == "battery"


def test_no_match():
    assert match_text("냉장고", ITEMS) is None
    assert match_text("   ", ITEMS) is None


def test_ambiguous_returns_none():
    # 같은 길이 별칭이 두 품목에 걸치면 고르지 않는다
    assert match_text("생수병이랑 소주병", ITEMS) is None
