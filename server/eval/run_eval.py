"""VLM 정답률 평가. eval/labels.csv(파일명,item_key) + eval/images/ → 정답률·혼동 품목.

  cd server && .venv/bin/python -m eval.run_eval [--provider mock] [--data-dir ../data] [--labels eval/labels-real.csv]
실물 촬영 목록: docs/research/eval-plan.md → eval/labels-real.csv, 사진은 eval/images/에.
정답 item_key에 'unknown'을 쓰면 '목록 밖 물건'을 unknown으로 거르는지 본다.
claude/gemini는 이미지 수만큼 유료 호출이 나간다.
"""
import argparse
import csv
from collections import Counter
from pathlib import Path

from app import data
from app.providers import get_provider

HERE = Path(__file__).parent


def evaluate(provider, items, labels_csv: Path, images_dir: Path):
    rows = list(csv.reader(labels_csv.open(encoding="utf-8")))
    if rows and rows[0][:2] == ["filename", "item_key"]:
        rows = rows[1:]
    correct, confusions, missing = 0, Counter(), []
    for filename, truth in rows:
        path = images_dir / filename
        if not path.exists():
            missing.append(filename)
            continue
        pred = provider.classify(path.read_bytes(), items).item_key or "unknown"
        if pred == truth:
            correct += 1
        else:
            confusions[(truth, pred)] += 1
    total = len(rows) - len(missing)
    return correct, total, confusions, missing


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", default="mock")
    ap.add_argument("--data-dir", default=None)
    ap.add_argument("--labels", default=str(HERE / "labels.csv"))
    ap.add_argument("--images", default=str(HERE / "images"))
    a = ap.parse_args()
    items = data.load(a.data_dir).items
    correct, total, confusions, missing = evaluate(get_provider(a.provider), items, Path(a.labels), Path(a.images))
    print(f"provider={a.provider}  정답 {correct}/{total}" + (f" = {correct / total:.1%}" if total else ""))
    for f in missing:
        print(f"  이미지 없음: {f}")
    if confusions:
        print("혼동 (정답 → 예측: 횟수)")
        for (t, p), n in confusions.most_common():
            print(f"  {t} → {p}: {n}")


if __name__ == "__main__":
    main()
