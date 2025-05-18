# AGENTS.md

> **Purpose:**
> This document is a comprehensive, explicit contract for AI agents (Codex, Cursor, etc.) integrating with the Portus project. It details not only the "what" and "how" of the codebase, but the "why," the invariants, the boundaries, and the meta-rules for safe, effective, and autonomous enhancement.  
> **This is not a README.** It is a living specification for agentic reasoning, validation, and contribution.

---

## 1. Project Intent & Invariants

### 1.1. Core Objective

Portus is a LAN orchestration platform for local DNS and reverse proxy management, providing a unified API and dashboard for service discovery, secure routing, and configuration.  
**Invariants:**
- All LAN services must be discoverable and configurable via API/UI.
- Security, modularity, and local-first operation are non-negotiable.
- All configuration/state is persisted (SQLite, Docker volumes).
- All secrets must be user-supplied and never hardcoded or exposed.

### 1.2. Architectural Principles

- **Separation of Concerns:**  
  - Backend (API, orchestration, DB) is strictly decoupled from frontend (UI).
  - Proxy (Zoraxy) and DNS (CoreDNS) are containerized, managed as external services.
- **Declarative Configuration:**  
  - All runtime configuration is via environment variables or persisted DB state.
- **Extensibility:**  
  - New services, routes, or plugins must not require core rewrites.
- **Observability:**  
  - Health, status, and logs are exposed via API and/or UI.

---

## 2. Directory & File System Map

### 2.1. ASCII Structure (tree -L 3)

```
.
├── backend
│   ├── app
│   │   ├── auth.py
│   │   ├── db.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── settings.py
│   ├── Dockerfile
│   ├── README.md
│   └── requirements.txt
├── data
│   ├── lan-orchestrator.db
│   └── test.db
├── docs
│   ├── architecture.md
│   ├── biometric.md
│   └── security.md
├── migrations
│   ├── env.py
│   ├── README.md
│   └── script.py.mako
├── scripts
│   ├── alembic.sh
│   ├── setup_coredns.sh
│   └── setup_zoraxy.sh
├── tests
│   ├── test_api.py
│   ├── test_auth_services.py
│   ├── test_auth.py
│   └── test_db.py
├── ui
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── assets
│   │   ├── components
│   │   ├── index.css
│   │   ├── lib
│   │   ├── main.tsx
│   │   ├── pages
│   │   ├── providers
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
```

### 2.2. Key File/Folder Roles (Function-Level)

#### backend/app/
- **main.py**: FastAPI entrypoint. All API routes are registered here. No direct business logic; only app setup, middleware, and router inclusion.
- **auth.py**: Authentication logic (login, session, WebAuthn). All auth endpoints and helpers reside here. Agents must not duplicate auth logic elsewhere.
- **db.py**: Database connection/session management. All DB access must go through this module. No direct DB calls outside this layer.
- **models.py**: SQLAlchemy models. Defines DB schema. Agents must not alter existing models without a migration.
- **schemas.py**: Pydantic schemas for API validation. All request/response validation must use these.
- **settings.py**: App configuration (env vars, defaults). All config must be loaded here; never hardcode in business logic.

#### ui/src/
- **App.tsx**: Root React component. All providers and routing are initialized here.
- **components/**: Stateless, reusable UI widgets. All new UI elements must be placed here unless they are page-specific.
- **pages/**: Route-level React components. Each page corresponds to a route.
- **lib/**: Utility functions and shared logic.
- **providers/**: React context providers (auth, theme, etc.).

#### tests/
- **test_api.py**: Backend API endpoint tests. Use fixtures and mock external dependencies.
- **test_auth_services.py**: Auth service logic tests. Isolate from DB where possible.
- **test_auth.py**: Auth endpoint tests. Cover all login/logout/session flows.
- **test_db.py**: DB model and migration tests. Use in-memory DB for isolation.

#### scripts/
- **alembic.sh**: DB migration helper. Use for Alembic operations.
- **setup_coredns.sh**: CoreDNS setup automation.
- **setup_zoraxy.sh**: Zoraxy proxy setup automation.

---

## 3. Setup, Build, and Execution

### 3.1. Environment
- **Backend:** Python 3.11+ (venv required)
- **Frontend:** Node.js 18+
- **Stack:** Docker Compose (for full orchestration)

### 3.2. Commands
- **Backend:**
  - `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
  - `uvicorn app.main:app --reload`
- **Frontend:**
  - `cd ui && npm install`
  - `npm run dev`
- **Full Stack:**
  - `docker-compose up -d --build`
  - Production: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`
- **Migrations:**
  - `alembic upgrade head` (after setting up `.venv` and installing requirements)
- **Makefile:**  
    Use `make ci`, `make lint`, `make test` for standardized workflows.

---

## 4. Testing, Validation, and Coverage

### 4.1. Frameworks
- **Backend:**  
  - Lint: `ruff check backend/app`
  - Test: `pytest`
- **Frontend:**  
  - Lint: `npm run lint`
  - Typecheck: `npm run typecheck`
  - (Add Jest/React Testing Library if not present; recommend for new tests)

### 4.2. Coverage
- **Minimum:** 85% for all new/modified code.
- **Measurement:**  
  - Backend: `pytest --cov=backend/app`
  - Frontend: `npm run test -- --coverage` (if configured)
- **Reporting:**  
  - Add/maintain coverage badges in README and CI.

### 4.3. Test Writing Conventions
- **Backend:**  
  - Place tests in `tests/` mirroring app structure.
  - Use fixtures for DB, API, and service mocks.
  - Isolate side-effects; use in-memory DB for unit tests.
- **Frontend:**  
  - Place tests alongside components or in `tests/`.
  - Use React Testing Library for UI, msw for API mocks.
- **All:**  
  - Name tests descriptively; one assertion per test where possible.
  - Remove or refactor skipped/failing tests unless issue referenced.

---

## 5. Coding Standards, Formatting, and Style

### 5.1. Tools
- **Backend:**  
  - Lint: Ruff (`ruff check`)
  - Formatting: Black (if not present, recommend adding)
- **Frontend:**  
  - Lint: ESLint (`npm run lint`)
  - Formatting: Prettier (if not present, recommend adding)
  - Typecheck: TypeScript (`npm run typecheck`)

### 5.2. Conventions
- **Naming:**  
  - Snake_case for Python, camelCase for JS/TS.
  - Descriptive, unambiguous names for all symbols.
- **Functions:**  
  - ≤ 50 lines, single responsibility, pure where possible.
  - Public APIs: docstrings (Python) or JSDoc (TS).
- **Modules:**  
  - One domain/feature per module.
  - No circular imports.
- **Dead Code:**  
  - Remove immediately unless issue referenced.
- **TODOs:**  
  - Only allowed with issue reference (`TODO(#123): ...`).

---

## 6. Git, Branching, and Contribution Protocol

### 6.1. Branching
- **Base:** `main`
- **Protected:** No direct pushes to `main`, `work`, or other protected branches.
- **Naming:**  
  - `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`
  - Use kebab-case, no spaces.

### 6.2. Commits
- **Conventional Commits:**  
  - `feat: add DNS override endpoint`
  - `fix: correct proxy healthcheck`
  - `chore: update dependencies`
- **Frequency:**  
  - Commit small, logical units; avoid large, monolithic commits.

### 6.3. Pull Requests
- **Process:**  
  - Push branch to origin, open PR.
  - Reference related issues in PR description.
  - Summarize changes, decisions, and validation steps.
  - All lint/tests must pass before review.
  - Record architectural or process decisions in PR discussion.

### 6.4. Reviews
- **Block merge** if:
  - Lint or tests fail.
  - Coverage drops below threshold.
  - Security or architectural invariants are violated.

---

## 7. AI Agent-Specific Rules & Permissions

### 7.1. Allowed Actions
- **Code:**  
  - All backend, frontend, test, and documentation files.
  - Add new modules, components, or tests as needed.
- **Docs:**  
  - Update or create Markdown docs for new features or changes.
- **Config:**  
  - Propose changes to `.env.example`, `docker-compose*.yml`, or Makefile, but never to `.env` or secrets.

### 7.2. Forbidden Actions
- **Never:**  
  - Expose, commit, or log secrets.
  - Push directly to protected branches.
  - Edit existing Alembic migrations (always create new).
  - Bypass main entrypoints (`main.py`, `index.tsx`).
  - Remove or downgrade security features.

### 7.3. Validation & Self-Review
- **Before PR:**  
  - Run all lint, typecheck, and test commands.
  - Ensure ≥ 85% coverage for new/changed code.
  - Check for dead code, TODOs without issues, and security leaks.
  - Summarize validation steps in PR.
- **If Lint/Test Fails:**  
  - Retry up to 3 times; if still failing, update memory and request clarification.
- **Security:**  
  - Scan for accidental secret exposure.
  - Add sensitive files to `.gitignore` if missing.

### 7.4. Reasoning & Autonomy
- **When in doubt:**  
  - Prefer explicitness; open an issue and mention "Master" for contradictions.
  - Present 2–3 options with pros/cons for ambiguous changes.
  - Record all decisions and rationale in PRs or issues.
- **Modularity:**  
  - Prefer pure, isolated functions and stateless components.
  - Avoid hidden side-effects; all state changes must be explicit.

---

## 8. Security & Environment
- **Secrets:**  
  - Only reference via environment variables.
  - `.env.example` must list all required variables.
- **Authentication:**  
  - Must be enabled in production.
  - All endpoints must respect `AUTH_ENABLED`.
- **TLS:**  
  - Strongly recommended; see Traefik config.
- **Hardening:**  
  - Follow `docs/security.md` for all deployments.

---

## 9. Documentation & Knowledge Management
- **Update docs** for all new features, architectural changes, or process updates.
- **Reference:**  
  - `README.md`: Human overview
  - `docs/architecture.md`: System diagram
  - `docs/biometric.md`: WebAuthn setup
  - `docs/security.md`: Security guide
  - `pipelines.md`: Dev/test/deploy workflows

---

## 10. Meta-Rules for Agentic Operation
- **Always:**  
  - Adhere to this AGENTS.md as the source of truth for agentic actions.
  - Validate, self-review, and document all changes.
  - Escalate contradictions or ambiguities via issues.
- **Never:**  
  - Assume intent not documented here or in referenced docs.
  - Make silent, sweeping changes; all must be explicit and justified.

---

**End of AGENTS.md**  
*(This document is a living contract. Update as the codebase, architecture, or process evolves.)* 