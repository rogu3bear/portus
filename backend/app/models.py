from sqlalchemy import Column, Integer, String, DateTime
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
