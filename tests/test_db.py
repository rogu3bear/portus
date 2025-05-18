import pytest
from sqlalchemy import create_engine
from datetime import datetime
from backend.app.db import Base, SessionLocal
from backend.app.models import Service

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
