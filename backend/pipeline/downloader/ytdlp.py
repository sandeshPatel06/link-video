"""yt-dlp wrapper — downloads best audio from a URL."""
from __future__ import annotations
import subprocess
import json
import shutil
from pathlib import Path
from typing import Callable, Optional
from utils.exceptions import DownloadError
from utils.logger import get_logger

log = get_logger("downloader")


def _ytdlp_bin() -> str:
    b = shutil.which("yt-dlp")
    if not b:
        raise DownloadError("yt-dlp not found in PATH. Install it with: pip install yt-dlp", retryable=False)
    return b


def get_info(url: str) -> dict:
    """Fetch video metadata without downloading."""
    cmd = [_ytdlp_bin(), "--dump-json", "--no-playlist", url]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            raise DownloadError(f"yt-dlp info failed: {result.stderr.strip()}")
        return json.loads(result.stdout.splitlines()[0])
    except subprocess.TimeoutExpired:
        raise DownloadError("yt-dlp info timed out.", retryable=True)
    except json.JSONDecodeError as e:
        raise DownloadError(f"Could not parse yt-dlp metadata: {e}", retryable=False)


def download_audio(
    url: str,
    output_dir: Path,
    progress_cb: Optional[Callable[[str], None]] = None,
) -> Path:
    """
    Download best audio from url into output_dir.
    Returns path to the downloaded file.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    output_template = str(output_dir / "%(id)s.%(ext)s")

    cmd = [
        _ytdlp_bin(),
        "--no-playlist",
        "--extract-audio",
        "--audio-format", "best",
        "--audio-quality", "0",
        "--output", output_template,
        "--no-mtime",
        url,
    ]

    log.info("Starting yt-dlp download: %s", url)
    try:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        for line in proc.stdout:
            line = line.rstrip()
            log.debug("yt-dlp: %s", line)
            if progress_cb and ("[download]" in line or "[ExtractAudio]" in line):
                progress_cb(line)

        proc.wait(timeout=600)
        if proc.returncode != 0:
            raise DownloadError(f"yt-dlp exited with code {proc.returncode}")
    except subprocess.TimeoutExpired:
        proc.kill()
        raise DownloadError("Download timed out (>10 min).", retryable=True)
    except FileNotFoundError:
        raise DownloadError("yt-dlp binary not found.", retryable=False)

    # Find the downloaded file
    files = sorted(output_dir.glob("*"), key=lambda f: f.stat().st_mtime, reverse=True)
    if not files:
        raise DownloadError("yt-dlp finished but no file was created.")
    return files[0]
