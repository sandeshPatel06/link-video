import pytest
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from pipeline.transcription.google_speech_t import GoogleSpeechTranscriber, BCP47_LANG_MAP


def test_bcp47_mapping():
    assert BCP47_LANG_MAP["hi"] == "hi-IN"
    assert BCP47_LANG_MAP["en"] == "en-US"
    assert BCP47_LANG_MAP["ur"] == "ur-PK"
    assert BCP47_LANG_MAP["es"] == "es-ES"


def test_google_speech_transcriber_init():
    t = GoogleSpeechTranscriber(chunk_duration=10.0)
    assert t.chunk_duration == 10.0
