.PHONY: help up dev dev-server dev-admin down clean whois db-dump db-dump-prisma db-restore-prisma

PROJECT_NAME := devcase

SERVER_DIR := server
ADMIN_DIR := admin

# Default target
run: up dev

# Start Docker services in detached mode
up:
	docker compose -p $(PROJECT_NAME) up -d

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
	docker compose down

# Stop Docker services and remove volumes
clean:
	docker compose down -v
	
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

# Reset database
prisma-reset:
	@cd $(SERVER_DIR) && npx prisma db push --force-reset

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
	@echo "  make prisma-reset      - Reset database"
	@echo "  make db-dump           - Dump Postgres database to backups/"
	@echo "  make db-dump-prisma    - Dump database for Prisma (prompts for DATABASE_URL)"
	@echo "  make db-restore-prisma - Restore db_dump.bak to Prisma (prompts for DATABASE_URL)"

# Dump Postgres database
db-dump:
	@mkdir -p backups
	docker compose exec db pg_dumpall -U postgres > backups/dump_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database dumped to backups/"

# Dump database for Prisma — prompts for DATABASE_URL
db-dump-prisma:
	@read -p "DATABASE_URL: " DATABASE_URL; \
	CLEAN_URL=$$(echo "$$DATABASE_URL" | sed 's/[&?]pool=[^&]*//g'); \
	docker compose exec db pg_dump -Fc -v -d "$$CLEAN_URL" -n public > db_dump.bak

# Restore database to Prisma — prompts for DATABASE_URL
db-restore-prisma:
	@read -p "DATABASE_URL: " DATABASE_URL; \
	CLEAN_URL=$$(echo "$$DATABASE_URL" | sed 's/[&?]pool=[^&]*//g'); \
	docker run --rm -v "$$(pwd)/db_dump.bak:/db_dump.bak" postgres:17 pg_restore -d "$$CLEAN_URL" -v --no-owner --no-privileges --clean --if-exists /db_dump.bak; \
	echo "-complete-"
