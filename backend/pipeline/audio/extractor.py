"""FFmpeg audio extractor — converts any media to 16kHz mono WAV."""
from __future__ import annotations
import subprocess
import shutil
from pathlib import Path
from typing import Optional
from utils.exceptions import FFmpegError
from utils.logger import get_logger

log = get_logger("audio")


def _ffmpeg_bin() -> str:
    b = shutil.which("ffmpeg")
    if not b:
        raise FFmpegError("ffmpeg not found in PATH.")
    return b


def get_duration(media_path: Path) -> Optional[float]:
    """Return media duration in seconds, or None on failure."""
    cmd = [
        _ffmpeg_bin(), "-i", str(media_path),
        "-f", "null", "-",
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        for line in result.stderr.splitlines():
            if "Duration:" in line:
                # Duration: HH:MM:SS.ms
                time_str = line.split("Duration:")[1].split(",")[0].strip()
                h, m, s = time_str.split(":")
                return int(h) * 3600 + int(m) * 60 + float(s)
    except Exception:
        pass
    return None


def extract_audio(
    media_path: Path,
    output_path: Path,
    sample_rate: int = 16000,
    channels: int = 1,
) -> Path:
    """
    Extract and normalize audio to WAV 16kHz mono PCM.
    Does NOT modify the original file.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        _ffmpeg_bin(),
        "-y",                        # overwrite output
        "-i", str(media_path),       # input
        "-vn",                       # no video
        "-acodec", "pcm_s16le",      # PCM 16-bit little-endian
        "-ar", str(sample_rate),     # sample rate
        "-ac", str(channels),        # mono
        "-af", "loudnorm",           # normalize loudness
        str(output_path),
    ]

    log.info("Extracting audio: %s → %s", media_path.name, output_path.name)
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=3600
        )
        if result.returncode != 0:
            stderr = result.stderr[-2000:]  # last 2k chars
            raise FFmpegError(f"FFmpeg failed (code {result.returncode}): {stderr}")
    except subprocess.TimeoutExpired:
        raise FFmpegError("FFmpeg timed out (>1 hour).")
    except FileNotFoundError:
        raise FFmpegError("ffmpeg binary not found.")

    if not output_path.exists() or output_path.stat().st_size == 0:
        raise FFmpegError("FFmpeg produced no output file.")

    log.info("Audio extracted: %s (%.1f MB)", output_path.name, output_path.stat().st_size / 1e6)
    return output_path
