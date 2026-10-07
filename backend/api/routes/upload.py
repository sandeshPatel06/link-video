"""File upload route — saves uploaded video to temp dir and returns a file path for the job."""
from __future__ import annotations
import shutil
import tempfile
import uuid
from pathlib import Path

import aiofiles
from fastapi import APIRouter, File, UploadFile, HTTPException

from config.settings import settings
from utils.logger import get_logger

log = get_logger("upload")
router = APIRouter()

# Max upload size: 2 GB
MAX_BYTES = 2 * 1024 * 1024 * 1024

ALLOWED_EXTENSIONS = {
    ".mp4", ".mkv", ".avi", ".mov", ".webm",
    ".mp3", ".m4a", ".wav", ".ogg", ".flac",
    ".ts", ".flv", ".wmv",
}


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    suffix = Path(file.filename or "video").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: '{suffix}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    upload_dir = settings.temp_dir / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)
    dest = upload_dir / f"{uuid.uuid4()}{suffix}"

    total = 0
    try:
        async with aiofiles.open(dest, "wb") as out:
            while chunk := await file.read(1024 * 1024):  # 1 MB chunks
                total += len(chunk)
                if total > MAX_BYTES:
                    raise HTTPException(status_code=413, detail="File too large (>2 GB).")
                await out.write(chunk)
    except HTTPException:
        dest.unlink(missing_ok=True)
        raise

    log.info("Uploaded: %s → %s (%.1f MB)", file.filename, dest.name, total / 1e6)
    return {"file_path": str(dest), "filename": file.filename, "size_bytes": total}
