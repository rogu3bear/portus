# Function Flow Diagrams

This document illustrates how user requests and internal agents move through Portus. Diagrams reference functions from the codebase for clarity.

## 1. System Overview

```
[User] -> [React UI] -> [FastAPI app.main] -> [SQLite DB]
                                 |-> [Zoraxy Proxy]
                                 |-> [CoreDNS]
```

The React front‑end sends API requests using `api-client.ts`. The FastAPI
`app` defined in `backend/app/main.py` persists state to SQLite and will
update Zoraxy and CoreDNS.

## 2. Login Flow

```
Browser
  | (username & password)
  v
LoginForm -> AuthProvider.login() -> authApi.login()
  |
  v
POST /auth/login -> login() -> set SESSION_COOKIE
  |
  v
Redirect -> protected route -> require_auth middleware
```

The cookie is used by `attach_user` middleware to populate
`request.state.user` for subsequent requests.

## 3. Service CRUD Flow

```
User -> ServicesPage
  |            |
  |            +----> servicesApi.{getAll,create,delete}
  |                            |
  |                            v
  |                   /services endpoints in main.py
  |                            |
  |                    SQLAlchemy models.Service
  |                            |
  +<----------- JSON response --+
```

Functions involved: `read_services`, `create_service`, and
`delete_service`. These depend on the `get_db` generator and the
`require_auth` dependency.

## 4. Middleware Pipeline

```
Request
  |-> attach_user
  |-> security_headers
  |-> route handler
  `-> Response
```

Both `attach_user` and `security_headers` are defined in `main.py` and run on
all requests.

## 5. WebAuthn Placeholder

```
User -> POST /auth/webauthn-placeholder
             `---> webauthn_placeholder() -> 501
```

These endpoints currently return *501 Not Implemented*. TODO(#202):
resolve merge conflict markers in `auth.py` and implement the full flow.
