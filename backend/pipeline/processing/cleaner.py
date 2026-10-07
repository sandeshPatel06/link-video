"""Post-processing: clean up transcription artifacts."""
from __future__ import annotations
import re
from pipeline.transcription.base import Segment, TranscriptResult
from typing import List


_REPEATED_PUNCT = re.compile(r"([.,!?])\1+")
_MULTI_SPACE = re.compile(r" {2,}")
_FILLER_PATTERN = re.compile(r"\b(uh+|um+|hmm+|er+)\b", re.IGNORECASE)


def _clean_text(text: str) -> str:
    text = text.strip()
    text = _FILLER_PATTERN.sub("", text)
    text = _REPEATED_PUNCT.sub(r"\1", text)
    text = _MULTI_SPACE.sub(" ", text)
    text = text.strip()
    # Capitalise first letter
    if text:
        text = text[0].upper() + text[1:]
    return text


def clean_segments(segments: List[Segment]) -> List[Segment]:
    cleaned = []
    for seg in segments:
        text = _clean_text(seg.text)
        if text:
            cleaned.append(Segment(start=seg.start, end=seg.end, text=text))
    return cleaned


def clean_transcript(result: TranscriptResult) -> TranscriptResult:
    # Only strip English filler words if language is explicitly English
    if result.language and result.language.lower().startswith("en"):
        cleaned = clean_segments(result.segments)
    else:
        cleaned = [Segment(start=s.start, end=s.end, text=s.text.strip()) for s in result.segments if s.text and s.text.strip()]

    return TranscriptResult(
        segments=cleaned,
        language=result.language,
        duration=result.duration,
    )
