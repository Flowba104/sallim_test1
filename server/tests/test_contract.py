"""shared/api-types.ts 와 실제 응답 모양이 같은지 (S1). 타입 파일을 고치면 이 테스트가 서버 불일치를 잡는다."""
import base64
import re
import typing
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app
from app.schemas import Category, WEEKDAYS

TS = (Path(__file__).parents[2] / "shared" / "api-types.ts").read_text(encoding="utf-8")
c = TestClient(app)
R = "test-region"


def ts_fields(name: str) -> tuple[set[str], set[str]]:
    """export type <name> = { ... }; 의 최상위 필드 → (필수, 전체)."""
    body = re.search(rf"export type {name} = \{{(.*?)\}};", TS, re.S).group(1)
    body = re.sub(r"//.*", "", body)
    body = re.sub(r"\{[^{}]*\}", "", body)  # 중첩 객체 안 필드 제외
    fields = re.findall(r"(\w+)(\??):", body)
    return {f for f, opt in fields if not opt}, {f for f, _ in fields}


def check(name: str, obj: dict):
    required, every = ts_fields(name)
    assert required <= obj.keys() <= every, (name, obj.keys() ^ every)


def test_parser_sanity():
    required, every = ts_fields("AskResponse")
    assert "note" in every - required and "follow_up" in required


def test_category_union_matches_server():
    ts = re.search(r"export type Category =(.*?);", TS, re.S).group(1)
    assert re.findall(r'"([^"]+)"', ts) == list(typing.get_args(Category))


def test_ask_shapes():
    responses = [
        c.post("/ask", json={"region_id": R, "question": "생수병"}).json(),
        c.post("/ask", json={"region_id": R, "question": "우주선"}).json(),  # unknown
        c.post("/ask", json={"region_id": R, "image_base64": base64.b64encode(b"MOCK:glass_bottle:0.4").decode()}).json(),
        c.post("/ask/followup", json={"region_id": R, "item_key": "pet_bottle_clear", "state": {"has_label": True}}).json(),
    ]
    for r in responses:
        check("AskResponse", r)
        assert set(r["next_days"]) <= set(WEEKDAYS)
        if r["follow_up"]:
            assert set(r["follow_up"]) == {"key", "question"}
            assert r["follow_up"]["key"] in ts_fields("ItemState")[1]
        for s in r["sources"]:
            check("Source", s)
    assert responses[1]["item_key"] is None and responses[1]["category"] is None


def test_schedule_and_regions_shapes():
    r = c.get("/schedule", params={"region_id": R}).json()
    check("ScheduleResponse", r)
    assert r["today"] in WEEKDAYS
    for reg in c.get("/regions").json():
        check("Region", reg)


def test_error_codes_match_server():
    ts = set(re.findall(r'"(\w+)"', re.search(r"export type ErrorCode =(.*?);", TS, re.S).group(1)))
    src = (Path(__file__).parents[1] / "app" / "main.py").read_text(encoding="utf-8")
    used = set(re.findall(r'(?:ApiError|error_json)\(\d+, "(\w+)"', src)) | {"not_found", "invalid_request"}
    assert ts == used
