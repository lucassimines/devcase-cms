.PHONY: help up dev dev-server dev-admin down clean whois db-sync-schema db-dump db-pull-prod-data db-restore-prod-data db-import-prod images-prune

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

# Reset local database (wipes public schema)
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
	@echo "  make db-import-prod    - Reset, migrate, download prod data, import"
	@echo "  make db-sync-schema    - Reset local DB and apply Prisma migrations (schema only)"
	@echo "  make db-pull-prod-data - Download production data only to backups/"
	@echo "  make db-restore-prod-data - Sync schema and import a data dump (DUMP_FILE= optional)"
	@echo "  make db-dump           - Dump local Postgres to backups/"
	@echo "  make images-prune      - Delete unreferenced files from server/public/images"

# Reset local DB and apply Prisma migrations (schema only, no data)
db-sync-schema: up prisma-reset
	@echo "Applying Prisma migrations..."
	@cd $(SERVER_DIR) && npx prisma migrate deploy
	@echo "Local schema ready."

# Download production data only (requires PROD_DATABASE_URL in server/.env)
db-pull-prod-data:
	@set -e; \
	set -a; [ -f $(SERVER_DIR)/.env ] && . $(SERVER_DIR)/.env; set +a; \
	if [ -z "$$PROD_DATABASE_URL" ]; then \
		echo "PROD_DATABASE_URL is not set. Add it to server/.env"; \
		exit 1; \
	fi; \
	mkdir -p backups; \
	CLEAN_URL=$$(echo "$$PROD_DATABASE_URL" | sed 's/[&?]pool=[^&]*//g'); \
	DUMP_FILE=backups/prod_data_$$(date +%Y%m%d_%H%M%S).sql; \
	echo "Downloading production data to $$DUMP_FILE..."; \
	docker run --rm postgres:17 pg_dump "$$CLEAN_URL" \
		--no-owner \
		--no-privileges \
		--data-only \
		--exclude-table-data='_prisma_migrations' \
		--schema=public \
		> "$$DUMP_FILE"; \
	echo "Saved to $$DUMP_FILE"

# Import a data-only dump into a migrated local schema
# Usage:
#   make db-restore-prod-data
#   make db-restore-prod-data DUMP_FILE=backups/prod_data_YYYYMMDD_HHMMSS.sql
db-restore-prod-data: db-sync-schema
	@set -e; \
	DUMP_FILE=$${DUMP_FILE:-$$(ls -1t backups/prod_data_*.sql 2>/dev/null | awk 'NR==1 { print; exit }')}; \
	if [ -z "$$DUMP_FILE" ]; then \
		echo "No data dump found in backups/. Pass DUMP_FILE=path/to/prod_data.sql"; \
		exit 1; \
	fi; \
	if [ ! -f "$$DUMP_FILE" ]; then \
		echo "Dump file not found: $$DUMP_FILE"; \
		exit 1; \
	fi; \
	echo "Importing data from $$DUMP_FILE..."; \
	$(COMPOSE) exec -T db pg_isready -U postgres >/dev/null; \
	$(COMPOSE) exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 < "$$DUMP_FILE"; \
	echo "Production data imported."

# Reset, migrate, download prod data, import (requires PROD_DATABASE_URL in server/.env)
db-import-prod: up
	@set -e; \
	$(MAKE) db-sync-schema; \
	$(MAKE) db-pull-prod-data; \
	DUMP_FILE=$$(ls -1t backups/prod_data_*.sql 2>/dev/null | awk 'NR==1 { print; exit }'); \
	echo "Importing data from $$DUMP_FILE..."; \
	$(COMPOSE) exec -T db pg_isready -U postgres >/dev/null; \
	$(COMPOSE) exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 < "$$DUMP_FILE"; \
	echo "Production data imported."

# Dump local Postgres database
db-dump:
	@mkdir -p backups
	$(COMPOSE) exec db pg_dumpall -U postgres > backups/dump_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database dumped to backups/"

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
