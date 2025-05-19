from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_webauthn_placeholder_unavailable():
    resp = client.post("/auth/webauthn-placeholder")
    assert resp.status_code == 501
    assert resp.json()["detail"] == "FIDO2 library not installed; biometric auth unavailable"
