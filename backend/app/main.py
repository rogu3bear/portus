from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.encoders import jsonable_encoder
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from . import models
from .schemas import Service, ServiceCreate
from .db import engine, SessionLocal
from .settings import settings
from .auth import router as auth_router, SESSION_COOKIE
import logging
import os
from typing import Dict

SECURITY_HEADERS = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    "Content-Security-Policy": "default-src 'self'",
}

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Portus API",
    description="Portus - Local DNS and Reverse-Proxy Orchestration System",
    version=os.getenv("API_VERSION", "0.1.0"),
    docs_url="/docs",
    redoc_url="/redoc",
    redirect_slashes=False,
)


@app.middleware("http")
async def attach_user(request: Request, call_next):
    """Attach authenticated user to request.state.user if present."""
    request.state.user = None
    if settings.auth_enabled:
        token = request.cookies.get(SESSION_COOKIE)
        if token:
            try:
                payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
                request.state.user = payload.get("sub")
            except JWTError:
                request.state.user = None
    response = await call_next(request)
    return response


@app.middleware("http")
async def security_headers(request: Request, call_next):
    """Add common security headers to every response."""
    response: Response = await call_next(request)
    for header, value in SECURITY_HEADERS.items():
        response.headers.setdefault(header, value)
    return response


def require_auth(request: Request):
    """Ensure requests are authenticated if ``AUTH_ENABLED`` is True."""
    if settings.auth_enabled and request.state.user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.include_router(auth_router)


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, str]:
    """Health check endpoint for monitoring and container orchestration."""
    return {"status": "ok"}


@app.get("/services", response_model=list[Service])
def read_services(
    db: Session = Depends(get_db), _=Depends(require_auth)
):
    return jsonable_encoder(db.query(models.Service).all())


@app.post("/services", response_model=Service, status_code=status.HTTP_201_CREATED)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    _=Depends(require_auth),
):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return jsonable_encoder(db_service)


@app.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_auth),
):
    logger.info(f"Attempting to delete service with id {service_id}")
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service is None:
        logger.info(f"Service with id {service_id} not found in database query")
        raise HTTPException(status_code=404, detail="Service not found")
    logger.info(f"Found service: {db_service}")
    db.delete(db_service)
    db.commit()
    logger.info(f"Deleted service with id {service_id}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/dashboard")
def dashboard(request: Request, _=Depends(require_auth)):
    """Return simple dashboard identifying the current user."""
    if not settings.auth_enabled:
        user = "anonymous"
    else:
        user = request.state.user or "anonymous"
    return {"user": user}
