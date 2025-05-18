# Portus Backend

This is the backend service for Portus, a local DNS and reverse-proxy orchestration system.

## Quickstart

From the project root run:

```bash
docker-compose up -d --build
```

This command launches the backend together with its supporting services using Docker Compose.


## Features

- RESTful API for managing services
- SQLite database for configuration storage
- Integration with Zoraxy reverse proxy
- Integration with CoreDNS for local DNS resolution
- Health check endpoints
- Logging and monitoring

## Development

### Prerequisites

- Python 3.11+
- SQLite 3
- Docker and Docker Compose (recommended)

### Setup

1. Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp ../.env.example ../.env
# Edit .env as needed
# The backend reads `DB_PATH` from this file to locate the SQLite database.
```

### Running the Application

#### Development Mode

```bash
uvicorn app.main:app --reload
```

#### Using Docker Compose

```bash
docker-compose up -d --build
```

### API Documentation

Once the application is running, you can access the following:

- API Documentation: http://localhost:8000/docs
- ReDoc Documentation: http://localhost:8000/redoc

### Authentication

The backend exposes an optional authentication system controlled by environment
variables. Set `AUTH_ENABLED=false` to disable login requirements. The session
cookie lifetime is configured with `AUTH_SESSION_EXPIRY_MINUTES`.

## Project Structure

```
backend/
├── app/                  # Application code
│   ├── __init__.py
│   ├── main.py           # FastAPI application
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   └── db.py             # Database connection
├── tests/                # Test files
├── requirements.txt      # Python dependencies
└── Dockerfile            # Docker configuration
```

## Testing

```bash
pytest
```

## Linting and Formatting

```bash
# Linting
ruff check .

# Formatting
black .
isort .
```

## Deployment

For production deployment, use the included Dockerfile and docker-compose.prod.yml:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## License

MIT
