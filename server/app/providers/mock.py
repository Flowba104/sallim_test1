"""결정적 Mock. 테스트·개발 기본값. 실제 사진은 항상 unknown.

이미지 바이트가 b"MOCK:<item_key>[:<confidence>]" 이면 그 품목을 돌려준다.
"""
from ..schemas import Item
from .base import Classification, VisionProvider


class MockVisionProvider(VisionProvider):
    name = "mock"

    def classify(self, image: bytes, items: dict[str, Item]) -> Classification:
        if image.startswith(b"MOCK:"):
            parts = image[5:].decode("utf-8", "ignore").strip().split(":")
            if parts[0] in items:
                conf = float(parts[1]) if len(parts) > 1 else 0.9
                return Classification(parts[0], conf)
        return Classification(None, 0.0)

    def match_text(self, question: str, items: dict[str, Item]) -> Classification:
        return Classification(None, 0.0)
