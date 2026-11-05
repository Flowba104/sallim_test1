import base64

from fastapi.testclient import TestClient

from app.main import app

c = TestClient(app)
R = "test-region"


def b64(s: bytes) -> str:
    return base64.b64encode(s).decode()


def test_regions():
    assert c.get("/regions").json() == [{"id": R, "name": "테스트구"}]


def test_ask_text_alias():
    r = c.post("/ask", json={"region_id": R, "question": "생수병 어떻게 버려?"}).json()
    assert r["item_key"] == "pet_bottle_clear" and r["confident"]
    assert r["follow_up"]["key"] == "has_label"


def test_ask_text_unknown_falls_back_to_mock():
    r = c.post("/ask", json={"region_id": R, "question": "우주선"}).json()
    assert r["item_key"] is None and not r["confident"]


def test_ask_image_mock():
    r = c.post("/ask", json={"region_id": R, "image_base64": b64(b"MOCK:glass_bottle")}).json()
    assert r["item_key"] == "glass_bottle" and r["next_days"] == ["화"]
    r = c.post("/ask", json={"region_id": R, "image_base64": "data:image/jpeg;base64," + b64(b"\xff\xd8real")}).json()
    assert r["item_key"] is None


def test_ask_low_confidence_image():
    r = c.post("/ask", json={"region_id": R, "image_base64": b64(b"MOCK:glass_bottle:0.4")}).json()
    assert r["item_key"] == "glass_bottle" and r["confident"] is False


def test_ask_errors():
    assert c.post("/ask", json={"region_id": R}).status_code == 422
    assert c.post("/ask", json={"region_id": R, "image_base64": "@@@"}).status_code == 422
    assert c.post("/ask", json={"region_id": "nope", "question": "생수병"}).status_code == 404


def test_followup():
    r = c.post("/ask/followup", json={"region_id": R, "item_key": "pet_bottle_clear",
                                       "state": {"has_label": True}}).json()
    assert "라벨을 먼저 떼야 해요." in r["answer"] and r["follow_up"]["key"] == "is_dirty"
    assert c.post("/ask/followup", json={"region_id": R, "item_key": "x", "state": {}}).status_code == 404
    assert c.post("/ask/followup", json={"region_id": R, "item_key": "pet_bottle_clear",
                                          "state": {"bogus": True}}).status_code == 422


def test_schedule():
    r = c.get("/schedule", params={"region_id": R}).json()
    assert list(r["week"]) == ["월", "화", "수", "목", "금", "토", "일"]
    assert r["today_categories"] == r["week"][r["today"]]
    assert c.get("/schedule", params={"region_id": "nope"}).status_code == 404


def test_note_passthrough(monkeypatch):
    from app.main import create_app
    from app import data
    from tests.conftest import FIXTURES
    store = data.load(FIXTURES)
    store.regions["test-region"].note = "아파트는 단지 안내를 따르세요"
    cc = TestClient(create_app(store))
    assert cc.get("/schedule", params={"region_id": R}).json()["note"] == "아파트는 단지 안내를 따르세요"
    r = cc.post("/ask", json={"region_id": R, "question": "생수병"}).json()
    assert r["note"] == "아파트는 단지 안내를 따르세요"
