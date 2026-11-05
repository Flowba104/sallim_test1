"""Gemini 비전 프로바이더 — 작성만. 유료 API 키로 과금되므로 오늘 밤 실행 금지."""
import base64
import os

import httpx

from ..schemas import Item
from .base import Classification, VisionProvider, build_prompt, parse_response


class GeminiVisionProvider(VisionProvider):
    name = "gemini"

    def __init__(self):
        self.api_key = os.environ["GEMINI_API_KEY"]
        self.model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

    def _call(self, parts: list) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
        r = httpx.post(url, timeout=30, headers={"x-goog-api-key": self.api_key}, json={
            "contents": [{"parts": parts}],
            "generationConfig": {"responseMimeType": "application/json", "maxOutputTokens": 200},
        })
        r.raise_for_status()
        cands = r.json().get("candidates", [])
        return "".join(p.get("text", "") for c in cands for p in c.get("content", {}).get("parts", []))

    def classify(self, image: bytes, items: dict[str, Item]) -> Classification:
        return parse_response(self._call([
            {"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(image).decode()}},
            {"text": build_prompt(items)},
        ]), items)

    def match_text(self, question: str, items: dict[str, Item]) -> Classification:
        return parse_response(self._call([{"text": build_prompt(items, question)}]), items)
