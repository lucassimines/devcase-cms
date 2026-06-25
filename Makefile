.PHONY: help up dev dev-server dev-admin down clean whois db-dump db-restore db-pull-prod db-import-prod db-dump-prisma db-restore-prisma images-prune

PROJECT_NAME := devcase

SERVER_DIR := server
ADMIN_DIR := admin
COMPOSE := docker compose -p $(PROJECT_NAME)

# Default target
run: up dev

# Start Docker services in detached mode
up:
	$(COMPOSE) up -d

# Run development servers for both admin and server concurrently
dev:
	@bash -c 'cd ${SERVER_DIR} && npm run dev & cd ${ADMIN_DIR} && npm run dev & wait'

# Run development server for server directory
dev-server:
	@cd $(SERVER_DIR) && && npm run dev

# Run development server for admin directory
dev-admin:
	@cd $(ADMIN_DIR) && npm run dev

# Stop Docker services
down:
	$(COMPOSE) down

# Stop Docker services and remove volumes
clean:
	$(COMPOSE) down -v
	
# Run Prisma Studio
prisma-studio:
	@cd $(SERVER_DIR) && npx prisma studio

# Run Prisma Seed
prisma-seed:
	@cd $(SERVER_DIR) && npx prisma db seed

# Run Prisma Generate
prisma-generate:
	@cd $(SERVER_DIR) && npx prisma generate

# Run Prisma New Migration
prisma-new-migration:
	@read -p "Migration name: " migration_name; \
	cd $(SERVER_DIR) && npx prisma migrate dev --name "$$migration_name"

# Run Prisma Migrate
prisma-migrate:
	@cd $(SERVER_DIR) && npx prisma migrate dev

# Reset local database (wipes public schema; dump recreates it on restore)
prisma-reset:
	@echo "Resetting local database..."
	@$(COMPOSE) exec -T db pg_isready -U postgres >/dev/null
	@$(COMPOSE) exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c \
		'DROP SCHEMA IF EXISTS public CASCADE;'
	@echo "Local database reset."

# Show help
help:
	@echo "Available targets:"
	@echo "  make                   - Run docker compose up -d and npm run dev for both admin and server (default)"
	@echo "  make up                - Start Docker services in detached mode"
	@echo "  make dev               - Run npm run dev in both admin and server directories"
	@echo "  make dev-server        - Run npm run dev in server directory"
	@echo "  make dev-admin         - Run npm run dev in admin directory"
	@echo "  make down              - Stop Docker services"
	@echo "  make clean             - Stop Docker services and remove volumes"
	@echo "  make help              - Show this help message"
	@echo "  make prisma-studio     - Run Prisma Studio"
	@echo "  make prisma-seed       - Run Prisma Seed"
	@echo "  make prisma-generate   - Run Prisma Generate"
	@echo "  make prisma-reset      - Wipe local public schema"
	@echo "  make db-dump           - Dump Postgres database to backups/"
	@echo "  make db-restore        - Restore SQL dump and apply pending Prisma migrations (DUMP_FILE=path optional)"
	@echo "  make db-pull-prod      - Download production database to backups/ (requires PROD_DATABASE_URL in server/.env)"
	@echo "  make db-import-prod    - Download production database and restore into local Docker Postgres"
	@echo "  make db-dump-prisma    - Dump database for Prisma (prompts for DATABASE_URL)"
	@echo "  make db-restore-prisma - Restore db_dump.bak to Prisma (prompts for DATABASE_URL)"
	@echo "  make images-prune      - Delete unreferenced files from server/public/images"

# Download production database (requires PROD_DATABASE_URL in server/.env)
db-pull-prod:
	@set -e; \
	set -a; [ -f $(SERVER_DIR)/.env ] && . $(SERVER_DIR)/.env; set +a; \
	if [ -z "$$PROD_DATABASE_URL" ]; then \
		echo "PROD_DATABASE_URL is not set. Add it to server/.env"; \
		exit 1; \
	fi; \
	mkdir -p backups; \
	CLEAN_URL=$$(echo "$$PROD_DATABASE_URL" | sed 's/[&?]pool=[^&]*//g'); \
	DUMP_FILE=backups/prod_$$(date +%Y%m%d_%H%M%S).sql; \
	echo "Downloading production database to $$DUMP_FILE..."; \
	docker run --rm postgres:17 pg_dump "$$CLEAN_URL" \
		--no-owner --no-privileges -n public \
		> "$$DUMP_FILE"; \
	echo "Saved to $$DUMP_FILE"

# Download production database and restore locally
db-import-prod: up db-pull-prod
	@DUMP_FILE=$$(ls -1t backups/prod_*.sql 2>/dev/null | awk 'NR==1 { print; exit }'); \
	$(MAKE) db-restore DUMP_FILE="$$DUMP_FILE"

# Dump Postgres database
db-dump:
	@mkdir -p backups
	$(COMPOSE) exec db pg_dumpall -U postgres > backups/dump_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database dumped to backups/"

# Restore SQL dump into local Docker Postgres
# Usage:
#   make db-restore
#   make db-restore DUMP_FILE=backups/dump_YYYYMMDD_HHMMSS.sql
db-restore: up prisma-reset
	@set -e; \
	DUMP_FILE=$${DUMP_FILE:-$$(ls -1t backups/dump_*.sql 2>/dev/null | awk 'NR==1 { print; exit }')}; \
	if [ -z "$$DUMP_FILE" ]; then \
		echo "No SQL dump found in backups/. Pass DUMP_FILE=path/to/dump.sql"; \
		exit 1; \
	fi; \
	if [ ! -f "$$DUMP_FILE" ]; then \
		echo "Dump file not found: $$DUMP_FILE"; \
		exit 1; \
	fi; \
	echo "Restoring $$DUMP_FILE into local Docker Postgres..."; \
	$(COMPOSE) exec -T db pg_isready -U postgres >/dev/null; \
	if awk '/^\\connect postgres$$/{found=1} END{exit found ? 0 : 1}' "$$DUMP_FILE"; then \
		echo "Detected pg_dumpall format; skipping global role/header section."; \
		awk 'found{print} /^\\connect postgres$$/{found=1}' "$$DUMP_FILE" | $(COMPOSE) exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1; \
	else \
		$(COMPOSE) exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 < "$$DUMP_FILE"; \
	fi; \
	echo "Restore complete."; \
	echo "Applying pending Prisma migrations..."; \
	cd $(SERVER_DIR) && npx prisma migrate deploy

# Dump database for Prisma — prompts for DATABASE_URL
db-dump-prisma:
	@read -p "DATABASE_URL: " DATABASE_URL; \
	CLEAN_URL=$$(echo "$$DATABASE_URL" | sed 's/[&?]pool=[^&]*//g'); \
	$(COMPOSE) exec db pg_dump -Fc -v -d "$$CLEAN_URL" -n public > db_dump.bak

# Restore database to Prisma — prompts for DATABASE_URL
db-restore-prisma:
	@read -p "DATABASE_URL: " DATABASE_URL; \
	CLEAN_URL=$$(echo "$$DATABASE_URL" | sed 's/[&?]pool=[^&]*//g'); \
	docker run --rm -v "$$(pwd)/db_dump.bak:/db_dump.bak" postgres:17 pg_restore -d "$$CLEAN_URL" -v --no-owner --no-privileges --clean --if-exists /db_dump.bak; \
	echo "-complete-"

# Delete image files that are not referenced in File table
images-prune:
	@set -e; \
	$(COMPOSE) exec -T db pg_isready -U postgres >/dev/null; \
	USED_FILE_LIST=$$(mktemp); \
	$(COMPOSE) exec -T db psql -U postgres -d postgres -At -c 'SELECT filename FROM "File";' > "$$USED_FILE_LIST"; \
	PRUNED=0; \
	for FILEPATH in server/public/images/* server/public/images/.*; do \
		[ -f "$$FILEPATH" ] || continue; \
		FILENAME=$$(basename "$$FILEPATH"); \
		[ "$$FILENAME" = "." ] || [ "$$FILENAME" = ".." ] && continue; \
		if ! awk -v f="$$FILENAME" '$$0==f {found=1} END{exit found?0:1}' "$$USED_FILE_LIST"; then \
			rm -f "$$FILEPATH"; \
			PRUNED=$$((PRUNED + 1)); \
		fi; \
	done; \
	rm -f "$$USED_FILE_LIST"; \
	echo "Pruned $$PRUNED unreferenced image(s)."
