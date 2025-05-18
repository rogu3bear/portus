from datetime import datetime, timedelta
import json
import os
from fastapi import APIRouter, HTTPException, Request, Response
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from .settings import settings

router = APIRouter(prefix="/auth", tags=["auth"])

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
USERS_FILE = os.getenv("USERS_FILE", "users.json")
SESSION_COOKIE = "portus_session"


def _load_users() -> dict:
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def _verify_password(plain_password: str, hashed_password: str) -> bool:
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def _authenticate_user(username: str, password: str) -> bool:
    users = _load_users()
    if username in users and _verify_password(password, users[username]):
        return True
    return False


class LoginRequest(BaseModel):
    username: str
    password: str
    remember_me: bool = False


@router.post("/login")
def login(data: LoginRequest, response: Response):
    """Authenticate user and set session cookie."""
    if not settings.auth_enabled:
        raise HTTPException(status_code=403, detail="Authentication disabled")

    if not _authenticate_user(data.username, data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    expiry = timedelta(minutes=settings.session_expiry_minutes)
    if not data.remember_me:
        expiry = timedelta(minutes=60)

    to_encode = {
        "sub": data.username,
        "exp": datetime.utcnow() + expiry,
    }
    token = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    response.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=int(expiry.total_seconds()),
        httponly=True,
        secure=True,  # keep strict security
        samesite="strict",  # enforce cross-site request restrictions
    )
    return {"status": "logged_in"}


@router.post("/logout")
def logout(response: Response):
    """Clear session cookie."""
    response.delete_cookie(SESSION_COOKIE)
    return {"status": "logged_out"}


@router.get("/status")
def status_endpoint(request: Request):
    """Return authentication status."""
    user = getattr(request.state, "user", None)
    return {
        "auth_enabled": settings.auth_enabled,
        "user": user,
    }


# In-memory stores for WebAuthn demo data. These are reset on restart.
# TODO: replace with persistent storage in production
WEBAUTHN_USERS: dict[str, bytes] = {}
WEBAUTHN_CREDS: dict[str, list] = {}
WEBAUTHN_STATE: dict[str, tuple] = {}


@router.get("/webauthn")
def webauthn_begin(username: str):
    """Begin WebAuthn registration or authentication for ``username``."""
    try:
        from fido2.webauthn import PublicKeyCredentialRpEntity, PublicKeyCredentialUserEntity
        from fido2.server import Fido2Server
    except Exception:  # pragma: no cover - library optional
        raise HTTPException(
            status_code=501,
            detail="FIDO2 library not installed; biometric auth unavailable",
        )

    rp = PublicKeyCredentialRpEntity("portus", "Portus")
    server = Fido2Server(rp)

    user = PublicKeyCredentialUserEntity(
        id=username.encode("utf-8"), name=username, display_name=username
    )

    if username not in WEBAUTHN_CREDS:
        registration_data, state = server.register_begin(user, credentials=[])
        WEBAUTHN_STATE[username] = ("register", state, server)
        return registration_data

    auth_data, state = server.authenticate_begin(WEBAUTHN_CREDS[username])
    WEBAUTHN_STATE[username] = ("authenticate", state, server)
    return auth_data


@router.post("/webauthn")
async def webauthn_complete(username: str, request: Request, response: Response):
    """Complete WebAuthn flow using data posted by the browser."""
    try:
        import importlib
        importlib.import_module("fido2")
    except Exception:  # pragma: no cover - library optional
        raise HTTPException(
            status_code=501,
            detail="FIDO2 library not installed; biometric auth unavailable",
        )

    if username not in WEBAUTHN_STATE:
        raise HTTPException(status_code=400, detail="No authentication in progress")

    mode, state, server = WEBAUTHN_STATE.pop(username)
    data = await request.json()

    if mode == "register":
        attestation = server.register_complete(state, data)
        WEBAUTHN_CREDS.setdefault(username, []).append(attestation.credential_data)
        return {"status": "registered"}

    # authenticate
    server.authenticate_complete(state, WEBAUTHN_CREDS[username], data)
    expiry = timedelta(minutes=settings.session_expiry_minutes)
    token = jwt.encode({"sub": username, "exp": datetime.utcnow() + expiry}, settings.secret_key, algorithm=settings.algorithm)
    response.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=int(expiry.total_seconds()),
        httponly=True,
        secure=True,  # keep strict security
        samesite="strict",  # enforce cross-site request restrictions
    )
    return {"status": "authenticated"}


# Also provide a placeholder endpoint for compatibility
@router.post("/webauthn-placeholder")
def webauthn_placeholder():
    """Attempt biometric authentication via WebAuthn (placeholder)."""
    try:
        from fido2.webauthn import PublicKeyCredentialRpEntity
        from fido2.server import Fido2Server
    except Exception:  # pragma: no cover - library optional
        raise HTTPException(
            status_code=501,
            detail="FIDO2 library not installed; biometric auth unavailable",
        )
    # TODO: Implement full WebAuthn registration and login flows
    rp = PublicKeyCredentialRpEntity("portus", "Portus")
    _ = Fido2Server(rp)
    return {"detail": "WebAuthn placeholder"}


class AuthConfig(BaseModel):
    """Configuration payload for authentication settings."""

    auth_enabled: bool | None = None
    session_expiry_minutes: int | None = None


@router.get("/config")
def get_config():
    """Return current authentication configuration."""
    return {
        "auth_enabled": settings.auth_enabled,
        "session_expiry_minutes": settings.session_expiry_minutes,
    }


@router.post("/config")
def update_config(config: AuthConfig):
    """Update authentication configuration at runtime."""
    if config.auth_enabled is not None:
        settings.auth_enabled = config.auth_enabled
    if config.session_expiry_minutes is not None:
        settings.session_expiry_minutes = config.session_expiry_minutes
    return {
        "auth_enabled": settings.auth_enabled,
        "session_expiry_minutes": settings.session_expiry_minutes,
    }
