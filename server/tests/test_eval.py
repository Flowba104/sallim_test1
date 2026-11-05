from pathlib import Path

from app import data
from app.providers import get_provider
from eval.run_eval import evaluate
from tests.conftest import FIXTURES

EVAL = Path(__file__).parents[1] / "eval"


def test_eval_samples_with_mock():
    items = data.load(FIXTURES).items
    correct, total, conf, missing = evaluate(get_provider("mock"), items, EVAL / "labels.csv", EVAL / "images")
    assert (correct, total, missing) == (3, 4, [])
    assert conf == {("pet_bottle_clear", "glass_bottle"): 1}
