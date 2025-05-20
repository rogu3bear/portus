from sqlalchemy import Column, Integer, String, DateTime, LargeBinary
from sqlalchemy.sql import func
from .db import Base

class Service(Base):
    __tablename__ = "service"

    id = Column(Integer, primary_key=True, index=True)
    dns_name = Column(String, index=True)
    host = Column(String)
    port = Column(Integer)
    proto = Column(String, default="http")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WebAuthnCredential(Base):
    """Persisted WebAuthn credential for biometric authentication."""

    __tablename__ = "webauthn_credential"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, nullable=False)
    credential_id = Column(String, unique=True, nullable=False)
    credential_data = Column(LargeBinary, nullable=False)
    sign_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
