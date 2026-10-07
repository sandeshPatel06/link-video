"""
Job store + pipeline runner.
Each job runs in a background thread and streams progress via SSE.
"""
from __future__ import annotations
import asyncio
import json
import shutil
import tempfile
import threading
import time
import uuid
from enum import Enum
from pathlib import Path
from typing import AsyncGenerator, Callable, Dict, List, Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from config.settings import settings
from pipeline.input.validator import validate_input
from pipeline.downloader.ytdlp import download_audio
from pipeline.audio.extractor import extract_audio, get_duration
from pipeline.transcription.faster_whisper_t import FasterWhisperTranscriber
from pipeline.transcription.google_speech_t import GoogleSpeechTranscriber
from pipeline.processing.cleaner import clean_transcript
from pipeline.output.writer import write_all
from utils.exceptions import VideoTranscriberError
from utils.logger import get_logger

log = get_logger("jobs")
router = APIRouter()


def _get_transcriber():
    if settings.transcription_provider == "google_speech":
        return GoogleSpeechTranscriber()
    return FasterWhisperTranscriber(
        model_size=settings.transcription_model,
        device="cpu",
        compute_type="int8",
    )


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    ERROR = "error"


class JobEvent:
    def __init__(self, stage: str, message: str, progress: int, status: str = "running"):
        self.stage = stage
        self.message = message
        self.progress = progress  # 0–100
        self.status = status
        self.ts = time.time()

    def to_dict(self) -> dict:
        return {
            "stage": self.stage,
            "message": self.message,
            "progress": self.progress,
            "status": self.status,
        }


class Job:
    def __init__(self, job_id: str, source: str, language: Optional[str] = None):
        self.job_id = job_id
        self.source = source
        self.language = language
        self.status = JobStatus.PENDING
        self.events: List[JobEvent] = []
        self.transcript_result: Optional[dict] = None  # in-memory, no disk writes
        self.error: Optional[str] = None
        self._lock = threading.Lock()

    def push(self, stage: str, message: str, progress: int, status: str = "running"):
        event = JobEvent(stage, message, progress, status)
        with self._lock:
            self.events.append(event)
        log.info("[%s] %s: %s (%d%%)", self.job_id[:8], stage, message, progress)


# In-memory job registry
_jobs: Dict[str, Job] = {}


def _get_job(job_id: str) -> Job:
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found.")
    return job


# ── Pipeline ──────────────────────────────────────────────────────────────────

def _run_pipeline(job: Job):
    """Run in a background thread."""
    tmp_dir = Path(tempfile.mkdtemp(prefix=f"vt_{job.job_id[:8]}_", dir=settings.temp_dir))
    try:
        job.status = JobStatus.RUNNING

        # Stage 1 — Validate
        job.push("validate", "Validating input…", 5)
        source, is_url = validate_input(job.source)

        media_path: Path
        if is_url:
            # Stage 2 — Download
            job.push("download", "Downloading media via yt-dlp…", 15)
            dl_dir = tmp_dir / "download"
            media_path = download_audio(
                source, dl_dir,
                progress_cb=lambda msg: job.push("download", msg[:120], 25),
            )
            job.push("download", f"Downloaded: {media_path.name}", 35)
        else:
            media_path = Path(source)
            job.push("download", "Using local file (skipping download).", 35)

        # Stage 3 — Extract audio
        job.push("audio", "Extracting and normalizing audio with FFmpeg…", 45)
        wav_path = tmp_dir / "audio.wav"
        extract_audio(media_path, wav_path, sample_rate=settings.audio_sample_rate)
        duration = get_duration(wav_path) or 0.0
        job.push("audio", f"Audio ready ({duration:.1f}s)", 55)

        # Stage 4 — Transcribe
        job.push("transcribe", f"Initializing {settings.transcription_provider} transcriber…", 60)
        transcriber = _get_transcriber()
        job.push("transcribe", "Transcribing audio (this may take a while)…", 65)
        target_lang = job.language or settings.default_language
        if target_lang == "auto":
            target_lang = None
        result = transcriber.transcribe(str(wav_path), language=target_lang)
        job.push("transcribe", f"Transcription complete ({len(result.segments)} segments, lang={result.language})", 85)

        # Stage 5 — Process + store in memory (no file writes)
        job.push("output", "Cleaning transcript…", 90)
        result = clean_transcript(result)
        job.transcript_result = {
            "source": job.source,
            "language": result.language,
            "duration": round(result.duration, 3),
            "segments": [s.to_dict() for s in result.segments],
        }

        job.push("done", "Transcription complete! Ready to download.", 100, status="done")
        job.status = JobStatus.DONE

    except VideoTranscriberError as e:
        job.error = str(e)
        job.status = JobStatus.ERROR
        job.push(e.stage, f"Error: {e}", 100, status="error")
        log.error("Pipeline error [%s]: %s", job.job_id[:8], e)

    except Exception as e:
        job.error = str(e)
        job.status = JobStatus.ERROR
        job.push("unknown", f"Unexpected error: {e}", 100, status="error")
        log.exception("Unexpected error in job %s", job.job_id)

    finally:
        # Always clean up temp dir
        try:
            shutil.rmtree(tmp_dir, ignore_errors=True)
        except Exception:
            pass


# ── Routes ────────────────────────────────────────────────────────────────────

class CreateJobRequest(BaseModel):
    source: str  # URL or file path (after upload)
    language: Optional[str] = None


@router.post("/jobs", status_code=201)
async def create_job(req: CreateJobRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    job = Job(job_id=job_id, source=req.source, language=req.language)
    _jobs[job_id] = job
    background_tasks.add_task(_run_pipeline, job)
    log.info("Created job %s for source: %s (language=%s)", job_id[:8], req.source[:80], req.language)
    return {"job_id": job_id}


@router.get("/jobs/{job_id}/status")
async def job_status(job_id: str):
    job = _get_job(job_id)
    return {
        "job_id": job_id,
        "status": job.status,
        "error": job.error,
        "events": [e.to_dict() for e in job.events],
    }


@router.get("/jobs/{job_id}/stream")
async def job_stream(job_id: str, request=None):
    """SSE endpoint — streams progress events."""
    job = _get_job(job_id)

    async def event_generator() -> AsyncGenerator[dict, None]:
        sent = 0
        while True:
            # Stop streaming if client disconnected
            if request is not None and await request.is_disconnected():
                log.info("SSE client disconnected for job %s", job_id[:8])
                break

            with job._lock:
                batch = job.events[sent:]
                sent += len(batch)
            for event in batch:
                yield {"data": json.dumps(event.to_dict())}
            if job.status in (JobStatus.DONE, JobStatus.ERROR):
                break
            await asyncio.sleep(0.3)

    return EventSourceResponse(event_generator())



@router.get("/jobs/{job_id}/result")
async def job_result(job_id: str):
    """Return the transcript JSON stored in memory (no file read needed)."""
    job = _get_job(job_id)
    if job.status != JobStatus.DONE:
        raise HTTPException(status_code=400, detail="Job not complete yet.")
    if job.transcript_result is None:
        raise HTTPException(status_code=404, detail="Result not available.")
    return job.transcript_result
