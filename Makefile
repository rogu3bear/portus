dev:                ## start dev stack
	docker compose --env-file .env.dev up -d --build

stop:               ## stop stack
	docker compose down

ci:                 ## lint
	ruff check backend/app

.PHONY: dev stop ci
