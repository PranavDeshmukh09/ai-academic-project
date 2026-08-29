import pytest

def test_root_health_endpoint(client):
    """TC_HEALTH_001: Verify root endpoint returns 200 OK."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data or "message" in data

def test_onboard_validation_empty_payload(client):
    """TC_ONBOARD_002: Verify onboard returns 422 Unprocessable Entity on empty body."""
    response = client.post("/onboard", json={})
    assert response.status_code == 422

def test_chat_validation_missing_fields(client):
    """TC_CHAT_002: Verify /chat rejects missing project_id or message."""
    response = client.post("/chat", json={"message": "hello"})
    assert response.status_code == 422

def test_initialize_validation_missing_id(client):
    """TC_INIT_002: Verify /initialize rejects invalid body."""
    response = client.post("/initialize", json={})
    assert response.status_code == 422

def test_progress_update_validation(client):
    """TC_PROGRESS_002: Verify /progress_update rejects empty body."""
    response = client.post("/progress_update", json={})
    assert response.status_code == 422
