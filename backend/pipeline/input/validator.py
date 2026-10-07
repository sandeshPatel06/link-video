"""Input validation — detect URL vs local file."""
from __future__ import annotations
import re
from pathlib import Path
from utils.exceptions import InputError

URL_PATTERN = re.compile(r"^https?://", re.IGNORECASE)


def validate_input(source: str) -> tuple[str, bool]:
    """
    Returns (source, is_url).
    Raises InputError if invalid.
    """
    source = source.strip()
    if not source:
        raise InputError("No input provided.")
    if URL_PATTERN.match(source):
        return source, True
    # Local file
    p = Path(source)
    if not p.exists():
        raise InputError(f"File not found: {source}")
    if not p.is_file():
        raise InputError(f"Not a file: {source}")
    if p.stat().st_size == 0:
        raise InputError(f"File is empty: {source}")
    return str(p.resolve()), False
