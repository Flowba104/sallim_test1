"""SaLLiM API. 실행: cd server && .venv/bin/uvicorn app.main:app --env-file .env"""
import base64
import binascii
from datetime import datetime
from zoneinfo import ZoneInfo

import httpx
from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from . import data
from .assemble import assemble, unknown_response
from .match import match_text
from .providers import VisionProvider, get_provider
from .providers.base import Classification
from .schemas import (WEEKDAYS, AskRequest, AskResponse, FollowUpRequest, Region,
                      ScheduleResponse)

MAX_IMAGE_BYTES = 3 * 1024 * 1024        # 긴 변 1024px JPEG는 보통 0.5MB 안쪽
MAX_BODY_BYTES = MAX_IMAGE_BYTES * 4 // 3 + 64 * 1024  # base64 부풀림 + JSON 여유
KST = ZoneInfo("Asia/Seoul")


class ApiError(Exception):
    """오류 응답은 전부 {"error": {"code", "message"}}. code 목록은 shared/api-types.ts ErrorCode."""
    def __init__(self, status: int, code: str, message: str):
        self.status, self.code, self.message = status, code, message


def error_json(status: int, code: str, message: str) -> JSONResponse:
    return JSONResponse({"error": {"code": code, "message": message}}, status_code=status)


def create_app(store: data.Store | None = None, provider: VisionProvider | None = None) -> FastAPI:
    store = store or data.load()       # 데이터가 틀리면 여기서 DataError로 기동 실패
    provider = provider or get_provider()
    app = FastAPI(title="SaLLiM API")

    @app.middleware("http")
    async def limit_body(request: Request, call_next):
        # shortcut: Content-Length만 본다(chunked 업로드는 통과), 공개 서버 전엔 프록시에서도 제한
        if int(request.headers.get("content-length") or 0) > MAX_BODY_BYTES:
            return error_json(413, "image_too_large", "사진이 너무 커요. 다시 찍어 주세요.")
        return await call_next(request)

    # 모바일 앱·개발용 웹 미리보기. 쿠키 인증이 없으므로 전체 허용. limit_body보다 나중 = 바깥 → 413에도 CORS 헤더.
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

    @app.exception_handler(ApiError)
    async def _api_error(_, e: ApiError):
        return error_json(e.status, e.code, e.message)

    @app.exception_handler(RequestValidationError)
    async def _invalid(_, e: RequestValidationError):
        return error_json(422, "invalid_request", "요청 형식이 올바르지 않아요.")

    @app.exception_handler(StarletteHTTPException)
    async def _http(_, e: StarletteHTTPException):
        return error_json(e.status_code, "not_found" if e.status_code == 404 else "invalid_request", str(e.detail))

    @app.exception_handler(Exception)
    async def _internal(_, e: Exception):
        return error_json(500, "internal_error", "서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.")

    def call_provider(fn, *args) -> Classification:
        try:
            return fn(*args, store.items)
        except httpx.TimeoutException:
            raise ApiError(504, "provider_timeout", "사진 분석이 오래 걸려요. 다시 시도하거나 이름으로 물어봐 주세요.")
        except httpx.HTTPError:
            raise ApiError(502, "provider_error", "사진 분석 서비스에 연결하지 못했어요. 이름으로 물어봐 주세요.")

    def region_or_404(region_id: str):
        region = store.regions.get(region_id)
        if region is None:
            raise ApiError(404, "region_not_found", f"알 수 없는 동네예요: {region_id}")
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
                raise ApiError(422, "invalid_image", "사진을 읽지 못했어요. 다시 찍어 주세요.")
            if len(image) > MAX_IMAGE_BYTES:
                raise ApiError(413, "image_too_large", "사진이 너무 커요. 다시 찍어 주세요.")
            return respond(call_provider(provider.classify, image), region)
        key = match_text(req.question, store.items)
        if key:
            return respond(Classification(key, 1.0), region)
        return respond(call_provider(provider.match_text, req.question), region)

    @app.post("/ask/followup", response_model=AskResponse)
    def followup(req: FollowUpRequest):
        region = region_or_404(req.region_id)
        item = store.items.get(req.item_key)
        if item is None:
            raise ApiError(404, "item_not_found", f"알 수 없는 품목이에요: {req.item_key}")
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
