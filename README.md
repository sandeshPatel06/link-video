# Video Transcriber

A full-stack web application that converts any video or audio to a high-quality transcript. Runs **fully locally** — no API keys, no cloud, your data never leaves your machine.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Vanilla CSS |
| Backend | FastAPI (Python 3.12) |
| Transcription | faster-whisper (local, CPU) |
| Download | yt-dlp |
| Audio | FFmpeg (16kHz mono WAV + loudnorm) |

## Requirements

- Python 3.10+
- Node.js 18+
- FFmpeg (already installed at `/home/reak/.local/bin/ffmpeg`)
- yt-dlp (already installed at `/home/reak/.local/bin/yt-dlp`)

## Quick Start

### 1. Backend

```bash
cd backend
python3 -m venv .venv          # create venv (only first time)
source .venv/bin/activate      # ← .venv NOT venv
pip install -r requirements.txt
cp .env.example .env           # edit if needed
uvicorn main:app --host 0.0.0.0 --port 8000 --reload   # ← main:app NOT app.main:app
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Usage

### URL input
Paste any yt-dlp-supported URL (YouTube, Vimeo, Twitter, etc.) and click **Transcribe**.

### File upload
Drag and drop a video or audio file (MP4, MKV, MOV, WebM, MP3, WAV, OGG, FLAC, M4A, and more).

### Language
Select a language from the dropdown or leave **Auto-detect**.

### Output formats
Download as **TXT**, **JSON** (with timestamps), **SRT** (subtitles), or **VTT** (web subtitles).

## Configuration

Edit `backend/.env`:

```
TRANSCRIPTION_MODEL=base    # tiny/base/small/medium/large
DEFAULT_LANGUAGE=auto       # e.g. en, es, fr, auto
CHUNK_DURATION=600          # seconds per chunk (future use)
OUTPUT_DIR=../outputs       # where transcripts are saved
TEMP_DIR=../temp            # where temp files go
```

**Model sizes** (tradeoff: speed vs quality, bigger = slower on CPU):

| Model | Size | Speed (CPU) |
|---|---|---|
| tiny | ~75 MB | fastest |
| base | ~145 MB | fast ✓ |
| small | ~460 MB | moderate |
| medium | ~1.5 GB | slow |
| large | ~3 GB | very slow |

## Testing

```bash
cd /path/to/project
backend/.venv/bin/python -m pytest tests/ -v
```

## Troubleshooting

**FFmpeg not found** — ensure it is in PATH or set the full path in `extractor.py`.

**yt-dlp download fails** — some sites require cookies. Set `YTDLP_COOKIES` to a cookies.txt file path.

**Transcription is slow** — use `tiny` model for speed or a smaller video. A GPU would dramatically speed this up.

**Port already in use** — change `--port 8000` for backend or configure Vite port in `vite.config.js`.
