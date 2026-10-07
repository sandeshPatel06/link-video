import pytest
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from pipeline.transcription.mock import MockTranscriber
from pipeline.processing.cleaner import clean_transcript
from pipeline.transcription.base import Segment, TranscriptResult


def test_mock_transcriber():
    t = MockTranscriber()
    result = t.transcribe("fake_audio.wav", language="en")
    assert result.language == "en"
    assert len(result.segments) > 0
    assert result.duration > 0


def test_clean_removes_fillers():
    result = TranscriptResult(
        segments=[Segment(0.0, 2.0, "uh hello um world")],
        language="en",
        duration=2.0,
    )
    cleaned = clean_transcript(result)
    text = cleaned.segments[0].text
    assert "uh" not in text.lower()
    assert "um" not in text.lower()
    assert "hello" in text.lower()


def test_clean_removes_empty():
    result = TranscriptResult(
        segments=[Segment(0.0, 1.0, "   "), Segment(1.0, 2.0, "hello")],
        language="en",
        duration=2.0,
    )
    cleaned = clean_transcript(result)
    assert len(cleaned.segments) == 1
    assert cleaned.segments[0].text == "Hello"


def test_full_text():
    result = TranscriptResult(
        segments=[Segment(0.0, 1.0, "Hello"), Segment(1.0, 2.0, "world")],
        language="en",
        duration=2.0,
    )
    assert result.full_text == "Hello world"
