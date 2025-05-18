from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_services_requires_auth():
    resp = client.get("/services/")
    assert resp.status_code == 401
