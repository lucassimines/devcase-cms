# Hourgrid

Time-tracking and client management platform for freelancers and agencies.

## Tech Stack

| Layer     | Technology                                                          |
| --------- | ------------------------------------------------------------------- |
| Frontend  | Nuxt 4, Vue 3, Nuxt UI, Tailwind CSS 4, Pinia, VueUse, i18n (pt-BR) |
| Backend   | Express 5, Node.js, TypeScript, JWT auth                            |
| Database  | PostgreSQL 17, Prisma ORM 7                                         |
| Dev Tools | Docker Compose, Makefile, Mailpit, ESLint, Prettier                 |

## Project Structure

```
hourgrid/
├── admin/             # Nuxt 4 frontend (SPA)
├── server/            # Express API
│   ├── prisma/        # Schema & migrations
│   └── src/
│       ├── admin/     # Admin routes, controllers, services, middleware
│       ├── client/    # Public client routes
│       ├── errors/    # Custom HTTP errors
│       ├── generated/ # Prisma generated client
│       ├── types/     # Shared TypeScript types
│       └── utils/     # Helpers (pagination, tokens, logger, etc.)
├── docker-compose.yml # Postgres, Mailpit, Redis
├── server.Dockerfile  # Multi-stage production build
└── Makefile           # Dev & DB shortcuts
```

## Getting Started

### Prerequisites

- Node.js 24+
- Docker & Docker Compose
- npm (server) / pnpm (admin)

### Setup

```bash
# Clone the repo
git clone git@github.com:lucassimines/hourgrid.git

# Start Postgres, Mailpit, Redis
make up

# Install dependencies
cd server && npm install && cd ..
cd admin && pnpm install && cd ..

# Run migrations & seed
cd server
npx prisma migrate dev
npx prisma db seed
cd ..
```

### Run

```bash
# Start everything (Docker + both dev servers)
make run

# Or individually
make dev-server   # Express API only
make dev-admin    # Nuxt frontend only
```

## Makefile Commands

| Command                  | Description                                 |
| ------------------------ | ------------------------------------------- |
| `make run`               | Start Docker + both dev servers             |
| `make up`                | Start Docker services                       |
| `make dev`               | Run both dev servers concurrently           |
| `make dev-server`        | Run Express API only                        |
| `make dev-admin`         | Run Nuxt frontend only                      |
| `make down`              | Stop Docker services                        |
| `make clean`             | Stop Docker + remove volumes                |
| `make prisma-studio`     | Open Prisma Studio                          |
| `make prisma-seed`       | Seed the database                           |
| `make prisma-migrate`    | Run Prisma migrations                       |
| `make prisma-reset`      | Force-reset the database                    |
| `make db-dump`           | Dump local Postgres to `backups/`           |
| `make db-dump-prisma`    | Dump remote DB (prompts for `DATABASE_URL`) |
| `make db-restore-prisma` | Restore `.bak` to remote DB                 |

## Production Infrastructure

| Service    | Provider  |
| ---------- | --------- |
| Database   | Prisma.io |
| API Server | Render    |
| Frontend   | Vercel    |
