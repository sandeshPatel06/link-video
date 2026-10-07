import json
import pytest
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from pipeline.transcription.base import Segment, TranscriptResult
from pipeline.output.writer import write_txt, write_json, write_srt, write_vtt, write_all


@pytest.fixture
def sample_result():
    return TranscriptResult(
        segments=[
            Segment(0.0, 2.5, "Hello world."),
            Segment(2.5, 5.0, "This is a test."),
        ],
        language="en",
        duration=5.0,
    )


def test_write_txt(tmp_path, sample_result):
    p = write_txt(sample_result, tmp_path / "out.txt")
    content = p.read_text()
    assert "Hello world." in content
    assert "This is a test." in content


def test_write_json(tmp_path, sample_result):
    p = write_json(sample_result, tmp_path / "out.json", source="test.mp4")
    data = json.loads(p.read_text())
    assert data["language"] == "en"
    assert data["duration"] == 5.0
    assert len(data["segments"]) == 2
    assert data["segments"][0]["start"] == 0.0


def test_write_srt(tmp_path, sample_result):
    p = write_srt(sample_result, tmp_path / "out.srt")
    content = p.read_text()
    assert "00:00:00,000 --> 00:00:02,500" in content
    assert "Hello world." in content


def test_write_vtt(tmp_path, sample_result):
    p = write_vtt(sample_result, tmp_path / "out.vtt")
    content = p.read_text()
    assert "WEBVTT" in content
    assert "00:00:00.000 --> 00:00:02.500" in content


def test_write_all(tmp_path, sample_result):
    files = write_all(sample_result, tmp_path, "test-job-id", source="video.mp4")
    assert set(files.keys()) == {"txt", "json", "srt", "vtt"}
    for fmt, path in files.items():
        assert path.exists(), f"{fmt} file missing"
