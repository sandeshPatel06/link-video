"""Pytest configuration — adds backend/ to sys.path so tests can import backend modules."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "backend"))
