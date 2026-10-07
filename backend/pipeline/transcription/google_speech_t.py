"""Google Speech-to-Text transcriber using Google Speech API."""
from __future__ import annotations
from pathlib import Path
from typing import Optional
import speech_recognition as sr

from pipeline.transcription.base import BaseTranscriber, Segment, TranscriptResult
from pipeline.audio.extractor import get_duration
from utils.exceptions import TranscriptionError
from utils.logger import get_logger

log = get_logger("google_speech")

# Map 2-letter ISO codes to Google BCP-47 tags
BCP47_LANG_MAP = {
    "hi": "hi-IN",
    "en": "en-US",
    "ur": "ur-PK",
    "es": "es-ES",
    "fr": "fr-FR",
    "de": "de-DE",
    "it": "it-IT",
    "pt": "pt-BR",
    "ru": "ru-RU",
    "zh": "zh-CN",
    "ja": "ja-JP",
    "ko": "ko-KR",
    "ar": "ar-SA",
    "tr": "tr-TR",
    "pl": "pl-PL",
    "uk": "uk-UA",
    "vi": "vi-VN",
    "id": "id-ID",
    "th": "th-TH",
    "cs": "cs-CZ",
    "da": "da-DK",
    "fi": "fi-FI",
    "el": "el-GR",
    "hu": "hu-HU",
    "no": "no-NO",
    "ro": "ro-RO",
    "sv": "sv-SE",
    "bn": "bn-IN",
    "mr": "mr-IN",
    "ta": "ta-IN",
    "te": "te-IN",
    "gu": "gu-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "pa": "pa-IN",
}


class GoogleSpeechTranscriber(BaseTranscriber):
    def __init__(self, chunk_duration: float = 35.0):
        self.chunk_duration = chunk_duration
        self.recognizer = sr.Recognizer()

    def transcribe(
        self,
        audio_path: str,
        language: Optional[str] = None,
    ) -> TranscriptResult:
        is_auto = not language or language == "auto"
        lang_code = language if not is_auto else "en"
        if is_auto:
            log.warning(
                "Google Speech API does not support true auto-detection; "
                "defaulting to 'en-US'. Pass an explicit language for best results."
            )
        target_lang = BCP47_LANG_MAP.get(lang_code, lang_code if "-" in lang_code else f"{lang_code}-{lang_code.upper()}")

        log.info("Transcribing with Google Speech-to-Text: %s (lang=%s)", audio_path, target_lang)

        segments = []
        try:
            with sr.AudioFile(audio_path) as source:
                total_duration = source.DURATION

                # For audio <= 60 seconds (Reels/Shorts/Clips), transcribe full audio in one pass to avoid cutting words
                if total_duration <= 65.0:
                    audio_data = self.recognizer.record(source)
                    try:
                        text = self.recognizer.recognize_google(audio_data, language=target_lang)
                        if text and text.strip():
                            segments.append(
                                Segment(
                                    start=0.0,
                                    end=round(total_duration, 2),
                                    text=text.strip(),
                                )
                            )
                            log.info("[0.0s → %.1fs] %s", total_duration, text.strip())
                    except sr.UnknownValueError:
                        log.warning("No speech recognized in full audio.")
                    except sr.RequestError as req_err:
                        log.error("Google Speech API request error: %s", req_err)
                        raise TranscriptionError(f"Google Speech API error: {req_err}")
                else:
                    # For longer audio files, transcribe in 35s chunks
                    current_time = 0.0
                    while current_time < total_duration:
                        seg_len = min(self.chunk_duration, total_duration - current_time)
                        audio_chunk = self.recognizer.record(source, duration=seg_len)
                        try:
                            text = self.recognizer.recognize_google(audio_chunk, language=target_lang)
                            if text and text.strip():
                                segments.append(
                                    Segment(
                                        start=round(current_time, 2),
                                        end=round(current_time + seg_len, 2),
                                        text=text.strip(),
                                    )
                                )
                                log.info("[%.1fs → %.1fs] %s", current_time, current_time + seg_len, text.strip())
                        except sr.UnknownValueError:
                            log.debug("Chunk [%.1fs → %.1fs] no speech recognized.", current_time, current_time + seg_len)
                        except sr.RequestError as req_err:
                            log.error("Google Speech API request error: %s", req_err)
                            raise TranscriptionError(f"Google Speech API error: {req_err}")

                        current_time += seg_len

        except Exception as e:
            if not isinstance(e, TranscriptionError):
                raise TranscriptionError(f"Google Speech-to-Text failed: {e}")
            raise e

        file_duration = get_duration(Path(audio_path)) or (segments[-1].end if segments else 0.0)
        log.info("Google Speech transcription done. Segments: %d, language: %s", len(segments), lang_code)
        return TranscriptResult(segments=segments, language=lang_code, duration=file_duration)
