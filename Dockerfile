FROM python:3.12-slim

# Install system dependencies (ffmpeg, curl, ca-certificates)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy application files
COPY backend/ ./backend/
RUN mkdir -p /app/outputs /app/temp

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=8000 \
    OUTPUT_DIR=/app/outputs \
    TEMP_DIR=/app/temp \
    TRANSCRIPTION_MODEL=base

WORKDIR /app/backend

EXPOSE 8000

# Start Uvicorn bound to 0.0.0.0 and dynamic PORT
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
