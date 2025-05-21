import json
import os
import sys
from fastapi.testclient import TestClient

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.main import app

client = TestClient(app)


def test_webauthn_placeholder_unavailable():
    resp = client.post("/auth/webauthn-placeholder")
    assert resp.status_code == 501
    assert resp.json()["detail"] == "FIDO2 library not installed; biometric auth unavailable"


def test_webauthn_endpoints_unavailable():
    resp = client.get("/auth/webauthn", params={"username": "alice"})
    assert resp.status_code == 501


def test_webauthn_register_options():
    # Skip actual WebAuthn tests for CI
    os.environ["TEST_MODE"] = "1"
    response = client.post("/auth/webauthn/register/begin", json={"username": "testuser"})
    assert response.status_code == 200
    data = response.json()
    assert "options" in data
