"""Abstract base class for transcribers."""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class Segment:
    start: float
    end: float
    text: str

    def to_dict(self) -> dict:
        return {"start": round(self.start, 3), "end": round(self.end, 3), "text": self.text.strip()}


@dataclass
class TranscriptResult:
    segments: List[Segment]
    language: str
    duration: float

    @property
    def full_text(self) -> str:
        return " ".join(s.text.strip() for s in self.segments if s.text.strip())


class BaseTranscriber(ABC):
    @abstractmethod
    def transcribe(
        self,
        audio_path: str,
        language: Optional[str] = None,
    ) -> TranscriptResult:
        """Transcribe audio file, return TranscriptResult."""
        ...
