[![GitHub](https://img.shields.io/badge/GitHub-rogu3bear%2Fportus-blue?logo=github)](https://github.com/rogu3bear/portus)

# Portus: LAN Orchestrator

[![CI](https://github.com/rogu3bear/portus/actions/workflows/ci.yml/badge.svg)](https://github.com/rogu3bear/portus/actions/workflows/ci.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/rogu3bear/portus)](https://hub.docker.com/r/rogu3bear/portus) <!-- TODO(#200): verify link once published -->

**Portus** is a local DNS and reverse-proxy orchestration system for managing services on a LAN.  
It integrates FastAPI, React, CoreDNS, and Zoraxy for seamless service discovery, routing, and management.

---

## Features

- RESTful API for orchestrating LAN services
- Local DNS management via CoreDNS
- Reverse proxy with Zoraxy
- SQLite-backed configuration
- Optional authentication (username/password, WebAuthn)
- React + Vite UI dashboard
- Dockerized deployment for easy setup
- Health checks and monitoring endpoints

---

## Repository

- **GitHub:** [https://github.com/rogu3bear/portus](https://github.com/rogu3bear/portus)

---

## Architecture

```
[ UI ] ---> [ Backend API ] ---> [ Zoraxy Proxy ]
                 |
                 +--> [ CoreDNS ]
                 |
                 +--> [ SQLite DB ]
```

- **UI:** React app for service management and authentication
- **Backend:** FastAPI orchestrates Zoraxy, CoreDNS, and DB
- **Zoraxy:** Reverse proxy for HTTP/TCP routing
- **CoreDNS:** Local DNS resolver for `.lan` domains
- **SQLite:** Configuration and state storage

---

## Tech Stack

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, Alembic, Uvicorn
- **Frontend:** React 18, Vite, TypeScript, TailwindCSS, shadcn/ui
- **Proxy:** Zoraxy (containerized)
- **DNS:** CoreDNS (containerized)
- **Database:** SQLite
- **CI/CD:** GitHub Actions
- **Containerization:** Docker, Docker Compose

---

## Quickstart

1. **Clone the repository:**
   ```bash
   git clone rogu3bear/portus.git
   cd portus
   ```

2. **Copy and configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```

3. **Start the stack:**
   ```bash
   docker-compose up -d --build
   ```

4. **Access services:**
   - API: [http://localhost:8000](http://localhost:8000)
   - UI: [http://localhost:5173](http://localhost:5173)

---

## Development

### Backend

- Python 3.11+ required
- Install dependencies:
  ```bash
  cd backend
  python -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  ```
- Run locally:
  ```bash
  uvicorn app.main:app --reload
  ```

### Frontend

- Node.js 18+ required
- Install dependencies:
  ```bash
  cd ui
  npm install
  ```
- Start dev server:
  ```bash
  npm run dev
  ```
- UI available at [http://localhost:5173](http://localhost:5173)

---

## Testing & Linting

- **Backend:**
  - Lint: `ruff check backend/app`
  - Test: `pytest`
- **Frontend:**
  - Lint: `npm run lint`
  - Typecheck: `npm run typecheck`
- **CI:**  
  GitHub Actions run lint and tests on push/PR.

---

## Environment Variables

See `.env.example` for all variables.  
Key settings:
- `API_PORT`, `API_HOST`, `DB_PATH`
- `ZORAXY_PORT`, `ZORAXY_ADMIN_USER`, `ZORAXY_ADMIN_PASSWORD`
- `DNS_PORT`, `DNS_DOMAIN`
- `UI_PORT`, `UI_API_URL`
- `SECRET_KEY`, `JWT_SECRET_KEY`, `AUTH_ENABLED`
- `CORS_ORIGINS`, `RATE_LIMIT_ENABLED`
- `TEST_MODE` controls stub behavior during tests
- **Change all secrets before production!**

## Advanced Configuration
See [docs/advanced-config.md](docs/advanced-config.md) for optional settings such as custom ports, TLS setup, and authentication tweaks.

## Authentication

- Toggle with `AUTH_ENABLED` in `.env`
- Session expiry: `AUTH_SESSION_EXPIRY_MINUTES`
- WebAuthn biometric login (see [docs/biometric.md](docs/biometric.md))
- Auth endpoints:
  - `POST /auth/login`, `POST /auth/logout`, `GET /auth/status`
  - `GET|POST /auth/webauthn` (biometric)
  - `GET /auth/config`, `POST /auth/config`

---

## Deployment

- **Production:**  
  ```bash
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
  ```
- **Reverse proxy:** Traefik config in `docker-compose.prod.yml`
- **Volumes:** Data and logs persisted via Docker volumes

---

## Security

- Set strong values for all secrets in `.env`
- Enable authentication in production
- TLS recommended (see Traefik config)
- HTTP security headers set by backend
- See [docs/security.md](docs/security.md) for hardening tips

---

## Contributing

- Branch from `main`
- Use Conventional Commits
- Run `make ci` and `pytest` before PR
- Open PRs for review

---

## Documentation

- [docs/index.md](docs/index.md): Overview of available documentation
- [docs/architecture.md](docs/architecture.md): System diagram
- [docs/biometric.md](docs/biometric.md): WebAuthn setup
- [docs/security.md](docs/security.md): Security guide
- [docs/advanced-config.md](docs/advanced-config.md): Optional settings
- [pipelines.md](pipelines.md): Dev/test/deploy workflows

---

## License

MIT

---


## Acknowledgements

- [Zoraxy](https://github.com/tobychui/zoraxy)
- [CoreDNS](https://coredns.io/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## Roadmap

- TODO(#123): Add project badges
- TODO(#124): Complete frontend and backend test coverage
- TODO(#125): Document advanced configuration options

---
