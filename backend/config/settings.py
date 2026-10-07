"""Settings loaded from .env or environment variables."""
from __future__ import annotations
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class Settings:
    transcription_model: str = os.getenv("TRANSCRIPTION_MODEL", "small")
    transcription_provider: str = os.getenv("TRANSCRIPTION_PROVIDER", "faster_whisper")
    default_language: str = os.getenv("DEFAULT_LANGUAGE", "en")
    chunk_duration: int = int(os.getenv("CHUNK_DURATION", "600"))
    audio_sample_rate: int = 16000
    audio_channels: int = 1
    output_dir: Path = Path(os.getenv("OUTPUT_DIR", "../outputs"))
    temp_dir: Path = Path(os.getenv("TEMP_DIR", "../temp"))

    def ensure_dirs(self):
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.temp_dir.mkdir(parents=True, exist_ok=True)


settings = Settings()
settings.ensure_dirs()
