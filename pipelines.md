# Pipelines Overview

This document describes the basic workflows for running Portus.

## Development Pipeline

1. Create a `.env` file from `.env.example` and adjust ports as needed.
2. Start the local stack:
   ```bash
   docker-compose up -d --build
   ```
3. Access the API at `http://localhost:8000` and the UI at `http://localhost:5173`.

```
  +---------+     +----------------+       +------------------+
  |  .env   | --> | docker-compose |  -->  | API & UI running |
  +---------+     +----------------+       +------------------+
```

## Test Pipeline

Use `make ci` to run linting and `pytest` for tests:

```bash
make ci
pytest
```

```
  +-------+     +--------+
  | ruff  | --> | pytest |
  +-------+     +--------+
```

## Deployment Pipeline

A minimal GitHub Actions workflow is provided in `.github/workflows/ci.yml`.
It installs dependencies, runs `ruff` and `pytest`, and can be used as a
reference for additional automation.

```
  +------------+     +---------------+     +-----------+
  | git push   | --> | GitHub Action | --> | Deployment|
  +------------+     +---------------+     +-----------+
```
