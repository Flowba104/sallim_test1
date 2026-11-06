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


def err(resp, status, code):
    assert resp.status_code == status, resp.text
    body = resp.json()
    assert set(body) == {"error"} and body["error"]["code"] == code and body["error"]["message"]


def test_ask_errors():
    err(c.post("/ask", json={"region_id": R}), 422, "invalid_request")
    err(c.post("/ask", json={"region_id": R, "image_base64": "@@@"}), 422, "invalid_image")
    err(c.post("/ask", json={"region_id": "nope", "question": "생수병"}), 404, "region_not_found")
    err(c.get("/nope"), 404, "not_found")


def test_image_size_limits(monkeypatch):
    from app import main
    monkeypatch.setattr(main, "MAX_IMAGE_BYTES", 10)
    err(c.post("/ask", json={"region_id": R, "image_base64": b64(b"MOCK:glass_bottle" * 2)}), 413, "image_too_large")
    big = "A" * (main.MAX_BODY_BYTES + 1)
    err(c.post("/ask", json={"region_id": R, "image_base64": big}), 413, "image_too_large")


def test_provider_failures():
    import httpx
    from app.main import create_app
    from app import data
    from app.providers.mock import MockVisionProvider
    from tests.conftest import FIXTURES

    class Slow(MockVisionProvider):
        def classify(self, image, items):
            raise httpx.ReadTimeout("slow")

        def match_text(self, question, items):
            raise httpx.ConnectError("down")

    cc = TestClient(create_app(data.load(FIXTURES), Slow()))
    err(cc.post("/ask", json={"region_id": R, "image_base64": b64(b"x")}), 504, "provider_timeout")
    err(cc.post("/ask", json={"region_id": R, "question": "우주선"}), 502, "provider_error")
    # 텍스트가 데이터에 바로 맞으면 프로바이더를 안 부르니 장애와 무관
    assert cc.post("/ask", json={"region_id": R, "question": "생수병"}).status_code == 200


def test_followup():
    r = c.post("/ask/followup", json={"region_id": R, "item_key": "pet_bottle_clear",
                                       "state": {"has_label": True}}).json()
    assert "라벨을 먼저 떼야 해요." in r["answer"] and r["follow_up"]["key"] == "is_dirty"
    err(c.post("/ask/followup", json={"region_id": R, "item_key": "x", "state": {}}), 404, "item_not_found")
    err(c.post("/ask/followup", json={"region_id": R, "item_key": "pet_bottle_clear",
                                       "state": {"bogus": True}}), 422, "invalid_request")


def test_schedule():
    r = c.get("/schedule", params={"region_id": R}).json()
    assert list(r["week"]) == ["월", "화", "수", "목", "금", "토", "일"]
    assert r["today_categories"] == r["week"][r["today"]]
    err(c.get("/schedule", params={"region_id": "nope"}), 404, "region_not_found")
    err(c.get("/schedule"), 422, "invalid_request")


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


def test_cors_on_errors():
    from app import main
    r = c.post("/ask", headers={"origin": "http://localhost:8081"},
               json={"region_id": R, "image_base64": "A" * (main.MAX_BODY_BYTES + 1)})
    assert r.status_code == 413 and r.headers["access-control-allow-origin"] == "*"
