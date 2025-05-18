from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_dashboard_requires_auth():
    response = client.get("/dashboard")
    assert response.status_code == 401

