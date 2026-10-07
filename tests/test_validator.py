"""Tests for input validator."""
import pytest
import tempfile
import os
from pathlib import Path

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from pipeline.input.validator import validate_input
from utils.exceptions import InputError


def test_valid_url():
    src, is_url = validate_input("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    assert is_url is True

def test_http_url():
    src, is_url = validate_input("http://example.com/video.mp4")
    assert is_url is True

def test_empty_input():
    with pytest.raises(InputError):
        validate_input("")

def test_missing_local_file():
    with pytest.raises(InputError):
        validate_input("/nonexistent/path/video.mp4")

def test_valid_local_file(tmp_path):
    f = tmp_path / "test.mp4"
    f.write_bytes(b"\x00" * 100)
    src, is_url = validate_input(str(f))
    assert is_url is False
    assert src == str(f.resolve())

def test_empty_local_file(tmp_path):
    f = tmp_path / "empty.mp4"
    f.write_bytes(b"")
    with pytest.raises(InputError):
        validate_input(str(f))
