"""Mock transcriber for tests — no model required."""
from __future__ import annotations
from typing import Optional
from .base import BaseTranscriber, Segment, TranscriptResult


class MockTranscriber(BaseTranscriber):
    def transcribe(self, audio_path: str, language: Optional[str] = None) -> TranscriptResult:
        return TranscriptResult(
            segments=[
                Segment(0.0, 2.5, "This is a mock transcription."),
                Segment(2.5, 5.0, "Used for testing purposes only."),
            ],
            language=language or "en",
            duration=5.0,
        )
