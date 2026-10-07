class VideoTranscriberError(Exception):
    def __init__(self, message: str, stage: str = "unknown", retryable: bool = False):
        self.stage = stage
        self.retryable = retryable
        super().__init__(message)

    def __str__(self):
        hint = " (retry may help)" if self.retryable else ""
        return f"[{self.stage}] {super().__str__()}{hint}"


class InputError(VideoTranscriberError):
    def __init__(self, msg): super().__init__(msg, "input")


class DownloadError(VideoTranscriberError):
    def __init__(self, msg, retryable=True): super().__init__(msg, "download", retryable)


class FFmpegError(VideoTranscriberError):
    def __init__(self, msg): super().__init__(msg, "ffmpeg")


class TranscriptionError(VideoTranscriberError):
    def __init__(self, msg): super().__init__(msg, "transcription")


class OutputError(VideoTranscriberError):
    def __init__(self, msg): super().__init__(msg, "output")
