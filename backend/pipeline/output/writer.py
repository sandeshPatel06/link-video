"""Output writers: TXT, JSON, SRT, VTT."""
from __future__ import annotations
import json
from pathlib import Path
from typing import List
from pipeline.transcription.base import TranscriptResult


def _format_srt_time(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def _format_vtt_time(seconds: float) -> str:
    return _format_srt_time(seconds).replace(",", ".")


def write_txt(result: TranscriptResult, path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        for seg in result.segments:
            f.write(seg.text.strip() + "\n")
    return path


def write_json(result: TranscriptResult, path: Path, source: str = "") -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    data = {
        "source": source,
        "language": result.language,
        "duration": round(result.duration, 3),
        "segments": [s.to_dict() for s in result.segments],
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


def write_srt(result: TranscriptResult, path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        for i, seg in enumerate(result.segments, 1):
            f.write(f"{i}\n")
            f.write(f"{_format_srt_time(seg.start)} --> {_format_srt_time(seg.end)}\n")
            f.write(f"{seg.text.strip()}\n\n")
    return path


def write_vtt(result: TranscriptResult, path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for seg in result.segments:
            f.write(f"{_format_vtt_time(seg.start)} --> {_format_vtt_time(seg.end)}\n")
            f.write(f"{seg.text.strip()}\n\n")
    return path


def write_all(result: TranscriptResult, output_dir: Path, job_id: str, source: str = "") -> dict:
    """Write all formats and return a dict of {format: path}."""
    base = output_dir / job_id
    return {
        "txt": write_txt(result, base.with_suffix(".txt")),
        "json": write_json(result, base.with_suffix(".json"), source=source),
        "srt": write_srt(result, base.with_suffix(".srt")),
        "vtt": write_vtt(result, base.with_suffix(".vtt")),
    }
