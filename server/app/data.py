"""data/ 로더. 스키마가 틀리면 시작 시 DataError로 멈춘다."""
import json
import os
from dataclasses import dataclass
from pathlib import Path

from pydantic import ValidationError

from .schemas import Item, RegionData

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data"


class DataError(RuntimeError):
    pass


@dataclass(frozen=True)
class Store:
    items: dict[str, Item]
    regions: dict[str, RegionData]


def _read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise DataError(f"데이터 파일 없음: {path}")
    except json.JSONDecodeError as e:
        raise DataError(f"JSON 문법 오류: {path}: {e}")


def _validate(model, raw, where: str):
    try:
        return model.model_validate(raw)
    except ValidationError as e:
        raise DataError(f"스키마 오류: {where}\n{e}")


def load(data_dir: Path | str | None = None) -> Store:
    data_dir = Path(data_dir or os.environ.get("SALLIM_DATA_DIR") or DEFAULT_DATA_DIR)
    raw_items = _read_json(data_dir / "items.json")
    if not isinstance(raw_items, dict) or not raw_items:
        raise DataError(f"items.json은 비어 있지 않은 객체여야 합니다: {data_dir / 'items.json'}")
    items = {}
    for key, raw in raw_items.items():
        if not key.isascii() or key != key.lower() or not key.replace("_", "").isalnum():
            raise DataError(f"item_key는 영문 snake_case여야 합니다: {key!r}")
        items[key] = _validate(Item, raw, f"items.json [{key}]")

    regions = {}
    for path in sorted((data_dir / "regions").glob("*.json")):
        region = _validate(RegionData, _read_json(path), str(path))
        if region.id != path.stem:
            raise DataError(f"region id({region.id})와 파일명({path.name})이 다릅니다")
        regions[region.id] = region
    if not regions:
        raise DataError(f"지역 데이터 없음: {data_dir / 'regions'}/*.json")
    return Store(items=items, regions=regions)
