#!/bin/bash
# Helper script to run Alembic with the correct PYTHONPATH
# Usage: ./scripts/alembic.sh [alembic arguments]

PROJECT_ROOT="$(dirname "$(dirname "$0")")"
export PYTHONPATH="$PROJECT_ROOT"

if [ -d "$PROJECT_ROOT/.venv" ]; then
    "$PROJECT_ROOT/.venv/bin/alembic" "$@"
else
    alembic "$@"
fi 