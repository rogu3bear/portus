import os
import sys
import uuid
import pytest
from sqlalchemy import create_engine
from datetime import datetime

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.db import Base, SessionLocal
from backend.app.models import Service

os.makedirs("data", exist_ok=True)
# Use an in-memory SQLite for tests
os.environ["DB_PATH"] = ":memory:"

SQLALCHEMY_DATABASE_URL = "sqlite:///./data/test.db"

@pytest.fixture(scope="module")
def engine():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)

def test_service_model(engine):
    session = SessionLocal(bind=engine)
    service = Service(dns_name="test.example", host="localhost", port=80)
    session.add(service)
    session.commit()
    assert service.id is not None
    assert service.dns_name == "test.example"
    assert service.host == "localhost"
    assert service.port == 80
    assert isinstance(service.created_at, datetime)
    session.close()

def setup_module():
    Base.metadata.create_all(bind=create_engine("sqlite:///:memory:"))

def test_session_creation():
    session = SessionLocal()
    assert session is not None
    session.close()

def test_db_connection():
    session = SessionLocal()
    # Simple query test
    result = session.execute("SELECT 1").fetchone()
    assert result[0] == 1
    session.close()
