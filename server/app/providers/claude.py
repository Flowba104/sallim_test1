"""Claude 비전 프로바이더 — 작성만. 유료 API 키로 과금되므로 오늘 밤 실행 금지."""
import base64
import os

import httpx

from ..schemas import Item
from .base import Classification, VisionProvider, build_prompt, parse_response

API_URL = "https://api.anthropic.com/v1/messages"


class ClaudeVisionProvider(VisionProvider):
    name = "claude"

    def __init__(self):
        self.api_key = os.environ["ANTHROPIC_API_KEY"]
        self.model = os.environ.get("CLAUDE_MODEL", "claude-sonnet-5-5")

    def _call(self, content: list) -> str:
        r = httpx.post(API_URL, timeout=30, headers={
            "x-api-key": self.api_key, "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }, json={"model": self.model, "max_tokens": 200,
                 "messages": [{"role": "user", "content": content}]})
        r.raise_for_status()
        return "".join(b.get("text", "") for b in r.json().get("content", []))

    def classify(self, image: bytes, items: dict[str, Item]) -> Classification:
        return parse_response(self._call([
            {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg",
                                         "data": base64.b64encode(image).decode()}},
            {"type": "text", "text": build_prompt(items)},
        ]), items)

    def match_text(self, question: str, items: dict[str, Item]) -> Classification:
        return parse_response(self._call([{"type": "text", "text": build_prompt(items, question)}]), items)
