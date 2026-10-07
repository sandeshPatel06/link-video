"""FastAPI application entry point."""
import os
import sys
from pathlib import Path

# Ensure backend/ is in sys.path for absolute imports
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import jobs, upload

app = FastAPI(
    title="VidScript API",
    version="1.0.0",
    description="AI video to script, video to text, and audio transcription service powered by faster-whisper.",
)

# Configurable CORS origins for development and production deployment
default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://linkvideo.shptechnology.online",
    "https://www.shptechnology.online",
]
env_origins = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [o.strip() for o in env_origins.split(",") if o.strip()] if env_origins else default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.pages\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(jobs.router, prefix="/api", tags=["jobs"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
