# Alembic Migrations

## Running Migrations Without Import Errors

To avoid import errors (e.g., `ModuleNotFoundError: No module named 'backend'`), always run Alembic with the project root in your `PYTHONPATH`.

### Example (from project root):

```sh
PYTHONPATH=. alembic upgrade head
```

Or, if using a virtual environment:

```sh
PYTHONPATH=. .venv/bin/alembic upgrade head
```

## Troubleshooting
- Ensure you are in the project root directory (where `backend/` and `migrations/` are located).
- If you still see import errors, check that `backend/` and `backend/app/` both contain `__init__.py` files.
- If you use an IDE, configure its run/debug settings to set `PYTHONPATH` to the project root. 