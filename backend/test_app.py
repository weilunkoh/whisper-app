import pytest
from app import app


@pytest.fixture
def client():
    """A test client for the app."""
    with app.test_client() as client:
        yield client


def test_health(client):
    """Check that health endpoint works."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json == {"status": "healthy"}


def test_transcribe(client):
    """Check that transcribe endpoint returns 400 when no file is uploaded."""
    response = client.post("/api/transcribe")
    assert response.status_code == 400


def test_transcriptions(client):
    """Check that transcriptions endpoint returns 400 when no parameters are passed."""
    response = client.get("/api/transcriptions")
    assert response.status_code == 400


def test_search(client):
    """Check that transcriptions endpoint returns 400 when no parameters are passed."""
    response = client.get("/api/search")
    assert response.status_code == 400


def test_postprocess(client):
    """Check that postprocess beta feature endpoint returns 400 when no parameters are passed."""
    response = client.post("/api/postprocess")
    assert response.status_code == 400
