import sys
import os
from fastapi.testclient import TestClient

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.main import app

client = TestClient(app)


def test_services_requires_auth():
    resp = client.get("/services/")
    assert resp.status_code == 401

def test_auth_config():
    pass
