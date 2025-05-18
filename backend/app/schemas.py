from pydantic import BaseModel
from datetime import datetime

class ServiceBase(BaseModel):
    dns_name: str
    host: str
    port: int
    proto: str = 'http'

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
