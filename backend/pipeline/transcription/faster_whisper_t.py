"""faster-whisper local transcriber."""
from __future__ import annotations
from typing import Optional
from pipeline.transcription.base import BaseTranscriber, Segment, TranscriptResult
from pipeline.audio.extractor import get_duration
from utils.exceptions import TranscriptionError
from utils.logger import get_logger
from pathlib import Path

log = get_logger("transcription")

_model_cache: dict = {}


def _load_model(model_size: str, device: str = "cpu", compute_type: str = "int8"):
    key = (model_size, device, compute_type)
    if key not in _model_cache:
        try:
            from faster_whisper import WhisperModel
        except ImportError:
            raise TranscriptionError(
                "faster-whisper is not installed. Run: pip install faster-whisper"
            )
        log.info("Loading Whisper model '%s' on %s ...", model_size, device)
        _model_cache[key] = WhisperModel(model_size, device=device, compute_type=compute_type)
        log.info("Model loaded.")
    return _model_cache[key]


LANGUAGE_PROMPTS = {
    "hi": "यह हिंदी भाषा में देवनागरी लिपि में है।",
    "ur": "یہ اردو زبان میں ہے۔",
    "ar": "هذا باللغة العربية.",
    "fa": "این به زبان فارسی است.",
    "bn": "এটি বাংলা ভাষায়।",
    "mr": "हे मराठी भाषेत आहे।",
    "ne": "यो नेपाली भाषामा छ।",
    "ta": "இது தமிழ் மொழியில் உள்ளது.",
    "te": "ఇది తెలుగు భాషలో ఉంది.",
    "gu": "આ ગુજરાતી ભાષામાં છે.",
    "kn": "ಇದು ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿದೆ.",
    "ml": "ഇത് മലയാളത്തിലാണ്.",
    "pa": "ਇਹ ਪੰਜਾਬੀ ਵਿੱਚ ਹੈ।",
}


class FasterWhisperTranscriber(BaseTranscriber):
    def __init__(self, model_size: str = "base", device: str = "cpu", compute_type: str = "int8"):
        self.model_size = model_size
        self.device = device
        self.compute_type = compute_type

    def transcribe(
        self,
        audio_path: str,
        language: Optional[str] = None,
    ) -> TranscriptResult:
        model = _load_model(self.model_size, self.device, self.compute_type)
        lang = None if language in (None, "auto", "") else language
        prompt = LANGUAGE_PROMPTS.get(lang) if lang else None

        log.info("Transcribing: %s (language=%s, prompt=%s)", audio_path, lang or "auto-detect", prompt)
        try:
            transcribe_kwargs = {
                "audio": audio_path,
                "language": lang,
                "beam_size": 5,
                "vad_filter": True,
                "vad_parameters": {"min_silence_duration_ms": 500},
                "word_timestamps": False,
            }
            if prompt:
                transcribe_kwargs["initial_prompt"] = prompt

            segments_iter, info = model.transcribe(**transcribe_kwargs)
            segments = []
            for seg in segments_iter:
                segments.append(Segment(start=seg.start, end=seg.end, text=seg.text))
                log.debug("[%.1fs → %.1fs] %s", seg.start, seg.end, seg.text.strip())
        except Exception as e:
            raise TranscriptionError(f"Whisper transcription failed: {e}")

        duration = get_duration(Path(audio_path)) or (segments[-1].end if segments else 0.0)
        detected_lang = info.language if hasattr(info, "language") else (lang or "unknown")
        log.info("Transcription done. Segments: %d, language: %s", len(segments), detected_lang)
        return TranscriptResult(segments=segments, language=detected_lang, duration=duration)
