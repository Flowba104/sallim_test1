"""SaLLiM API. 실행: cd server && .venv/bin/uvicorn app.main:app --env-file .env"""
import base64
import binascii
from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from . import data
from .assemble import assemble, unknown_response
from .match import match_text
from .providers import VisionProvider, get_provider
from .providers.base import Classification
from .schemas import (WEEKDAYS, AskRequest, AskResponse, FollowUpRequest, Region,
                      ScheduleResponse)

MAX_IMAGE_BYTES = 8 * 1024 * 1024
KST = ZoneInfo("Asia/Seoul")


def create_app(store: data.Store | None = None, provider: VisionProvider | None = None) -> FastAPI:
    store = store or data.load()       # 데이터가 틀리면 여기서 DataError로 기동 실패
    provider = provider or get_provider()
    app = FastAPI(title="SaLLiM API")
    # 모바일 앱·개발용 웹 미리보기. 쿠키 인증이 없으므로 전체 허용.
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

    def region_or_404(region_id: str):
        region = store.regions.get(region_id)
        if region is None:
            raise HTTPException(404, f"알 수 없는 region_id: {region_id}")
        return region

    def respond(c: Classification, region) -> AskResponse:
        if c.item_key not in store.items:
            return unknown_response()
        return assemble(c.item_key, store.items[c.item_key], region, c.state, c.confidence)

    @app.get("/regions", response_model=list[Region])
    def regions():
        return [Region(id=r.id, name=r.name) for r in store.regions.values()]

    @app.post("/ask", response_model=AskResponse)
    def ask(req: AskRequest):
        region = region_or_404(req.region_id)
        if req.image_base64:
            b64 = req.image_base64.split(",", 1)[-1]  # data URL 접두어 허용
            try:
                image = base64.b64decode(b64, validate=True)
            except (binascii.Error, ValueError):
                raise HTTPException(422, "image_base64가 올바른 base64가 아닙니다")
            if len(image) > MAX_IMAGE_BYTES:
                raise HTTPException(413, "이미지가 너무 큽니다 (긴 변 1024px JPEG로 줄여 주세요)")
            return respond(provider.classify(image, store.items), region)
        key = match_text(req.question, store.items)
        if key:
            return respond(Classification(key, 1.0), region)
        return respond(provider.match_text(req.question, store.items), region)

    @app.post("/ask/followup", response_model=AskResponse)
    def followup(req: FollowUpRequest):
        region = region_or_404(req.region_id)
        item = store.items.get(req.item_key)
        if item is None:
            raise HTTPException(404, f"알 수 없는 item_key: {req.item_key}")
        return assemble(req.item_key, item, region, req.state, 1.0)

    @app.get("/schedule", response_model=ScheduleResponse)
    def schedule(region_id: str = Query(...)):
        region = region_or_404(region_id)
        today = WEEKDAYS[datetime.now(KST).weekday()]
        return ScheduleResponse(
            region_id=region.id, today=today,
            today_categories=list(region.week.get(today, [])),
            week={d: list(region.week.get(d, [])) for d in WEEKDAYS},
            time=region.time, sources=region.sources, note=region.note,
        )

    return app


app = create_app()
