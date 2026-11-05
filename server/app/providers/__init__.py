import os

from .base import Classification, VisionProvider
from .mock import MockVisionProvider


def get_provider(name: str | None = None) -> VisionProvider:
    name = (name or os.environ.get("VISION_PROVIDER") or "mock").lower()
    if name == "mock":
        return MockVisionProvider()
    if name == "claude":
        from .claude import ClaudeVisionProvider
        return ClaudeVisionProvider()
    if name == "gemini":
        from .gemini import GeminiVisionProvider
        return GeminiVisionProvider()
    raise ValueError(f"알 수 없는 VISION_PROVIDER: {name} (mock|claude|gemini)")
