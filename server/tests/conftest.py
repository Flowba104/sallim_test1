import os
from pathlib import Path

FIXTURES = Path(__file__).parent / "fixtures"
# app.main은 import 시 데이터를 읽으므로 그 전에 픽스처로 돌린다
os.environ["SALLIM_DATA_DIR"] = str(FIXTURES)
os.environ["VISION_PROVIDER"] = "mock"
