import os
import sys
from fastapi.testclient import TestClient

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.main import app

client = TestClient(app)


def test_dashboard_requires_auth():
    response = client.get("/dashboard")
    assert response.status_code == 401


def test_auth_disabled():
    os.environ["AUTH_ENABLED"] = "false"

