import pytest
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from api.routes.jobs import Job, CreateJobRequest


def test_job_language_init():
    job_auto = Job("job-1", "http://example.com/video")
    assert job_auto.language is None

    job_es = Job("job-2", "http://example.com/video", language="es")
    assert job_es.language == "es"


def test_create_job_request_model():
    req1 = CreateJobRequest(source="http://example.com/video")
    assert req1.language is None

    req2 = CreateJobRequest(source="http://example.com/video", language="fr")
    assert req2.language == "fr"
