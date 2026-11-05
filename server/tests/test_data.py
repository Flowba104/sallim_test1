import json
import shutil

import pytest

from app import data
from tests.conftest import FIXTURES


def copy_fixtures(tmp_path):
    shutil.copytree(FIXTURES, tmp_path, dirs_exist_ok=True)
    return tmp_path


def test_fixtures_load():
    store = data.load(FIXTURES)
    assert set(store.items) == {"pet_bottle_clear", "glass_bottle", "battery"}
    assert "test-region" in store.regions


@pytest.mark.parametrize("mutate, msg", [
    (lambda it: it["glass_bottle"].pop("sources"), "glass_bottle"),            # 출처 없음
    (lambda it: it["glass_bottle"].update(category="유리"), "glass_bottle"),     # 없는 카테고리
    (lambda it: it["pet_bottle_clear"]["conditions"].update(has_cap="x"), "pet_bottle_clear"),  # 없는 상태 키
    (lambda it: it.update({"Bad-Key": it["glass_bottle"]}), "Bad-Key"),
])
def test_bad_items_fail_loudly(tmp_path, mutate, msg):
    d = copy_fixtures(tmp_path)
    items = json.loads((d / "items.json").read_text())
    mutate(items)
    (d / "items.json").write_text(json.dumps(items, ensure_ascii=False))
    with pytest.raises(data.DataError, match=msg):
        data.load(d)


def test_region_id_must_match_filename(tmp_path):
    d = copy_fixtures(tmp_path)
    (d / "regions" / "test-region.json").rename(d / "regions" / "other.json")
    with pytest.raises(data.DataError, match="파일명"):
        data.load(d)


def test_missing_items_file(tmp_path):
    with pytest.raises(data.DataError, match="없음"):
        data.load(tmp_path)
