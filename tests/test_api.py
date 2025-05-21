import os
import sys
from fastapi.testclient import TestClient

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.main import app

os.makedirs("data", exist_ok=True)
os.environ["DB_PATH"] = "./data/test_api.db"

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_and_delete_service():
    payload = {"dns_name": "test.lan", "host": "127.0.0.1", "port": 8080}
    response = client.post("/services", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["dns_name"] == "test.lan"
    service_id = data["id"]

    list_resp = client.get("/services")
    assert any(item["id"] == service_id for item in list_resp.json())

    del_resp = client.delete(f"/services/{service_id}")
    assert del_resp.status_code == 204

