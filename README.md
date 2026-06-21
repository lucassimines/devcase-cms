# Devcase CMS

Headless CMS for developer portfolios — an admin panel and public REST API that powers [Devcase Web](https://github.com/lucassimines/devcase-web).

[![License: PolyForm Shield](https://img.shields.io/badge/License-PolyForm%20Shield-red.svg)](LICENSE)

> This repository is **public and source available**, not open source under OSI terms. You may view, learn from, and contribute to the code, but you may not offer a competing product or resell it as a service. See [License](#license).

## Overview

Devcase CMS separates content management from presentation:

| Layer | Role |
| ----- | ---- |
| **Admin panel** (`admin/`) | Nuxt 4 SPA for editors — manage pages, projects, solutions, technologies, media, and users |
| **Admin API** (`/api/v1/admin/*`) | Authenticated CRUD, file uploads, cache revalidation |
| **Public API** (`/api/v1/*`) | Headless content delivery for frontends — pages, projects, bootstrap data, sitemap |

Content is stored as structured JSON (blocks, metadata) in PostgreSQL and served to decoupled frontends.

## Companion Frontend

This CMS and its APIs are **ready to work with** [Devcase Web](https://github.com/lucassimines/devcase-web) — a portfolio site for developers to showcase their projects, powered by the public headless API (`/api/v1/*`).

| Piece | Repository | Role |
| ----- | ---------- | ---- |
| **CMS & APIs** | [devcase-cms](https://github.com/lucassimines/devcase-cms) (this repo) | Admin panel, content storage, public & admin APIs |
| **Frontend** | [devcase-web](https://github.com/lucassimines/devcase-web) | Developer portfolio site — pages, projects, bootstrap data, sitemap |

Run the CMS locally (or point at production), configure the web app with your API base URL, and the two repos work together out of the box.

## Tech Stack

| Layer     | Technology                                                          |
| --------- | ------------------------------------------------------------------- |
| Frontend  | Nuxt 4, Vue 3, Nuxt UI, Tailwind CSS 4, Pinia, VueUse, i18n (pt-BR) |
| Backend   | Express 5, Node.js, TypeScript, JWT auth                            |
| Database  | PostgreSQL 17, Prisma ORM 7                                         |
| Dev Tools | Docker Compose, Makefile, Mailpit, ESLint, Prettier                 |

## Content Types

| Entity       | Description                                      |
| ------------ | ------------------------------------------------ |
| **Pages**    | Site pages with slug, JSON content, and blocks   |
| **Projects** | Portfolio entries with technologies and solutions |
| **Solutions**| Service/solution catalog items                   |
| **Technologies** | Tech stack tags linked to projects           |
| **Files**    | Media library (images served from `/static`)     |

## Project Structure

```
devcase-cms/
├── admin/             # Nuxt 4 admin panel (SPA)
├── server/            # Express API
│   ├── prisma/        # Schema & migrations
│   └── src/
│       ├── admin/     # Authenticated admin routes, controllers, services
│       ├── web/       # Public headless API (pages, projects, sitemap)
│       ├── errors/    # Custom HTTP errors
│       ├── generated/ # Prisma generated client
│       ├── types/     # Shared TypeScript types
│       └── utils/     # Helpers (pagination, tokens, logger, etc.)
├── docker-compose.yml # Postgres, Mailpit, Redis
├── server.Dockerfile  # Multi-stage production build
└── Makefile           # Dev & DB shortcuts
```

## API Routes

Base path: `/api/v1` (configurable via `API_BASE_PATH`).

**Public (headless)**

| Method | Path                  | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/bootstrap`          | Site menu / bootstrap data |
| GET    | `/pages/:slug`        | Page by slug             |
| GET    | `/projects/:slug`     | Project by slug          |
| GET    | `/sitemap`            | Sitemap entries          |
| GET    | `/health`             | Health check             |
| GET    | `/static/images/*`    | Uploaded media           |

**Admin (JWT required)**

| Prefix              | Resources                              |
| ------------------- | -------------------------------------- |
| `/auth`             | Login, register, token refresh         |
| `/admin/page`       | Pages CRUD                             |
| `/admin/project`    | Projects CRUD                          |
| `/admin/solution`   | Solutions CRUD                         |
| `/admin/technology` | Technologies CRUD                    |
| `/admin/file`       | Media uploads                          |
| `/admin/user`       | User management                        |
| `/admin/revalidate` | Trigger frontend ISR revalidation    |

## Getting Started

### Prerequisites

- Node.js 24+
- Docker & Docker Compose
- npm (server) / pnpm (admin)

### Setup

```bash
# Clone the repo
git clone git@github.com:lucassimines/devcase-cms.git

# Start Postgres, Mailpit, Redis
make up

# Install dependencies
cd server && npm install && cd ..
cd admin && pnpm install && cd ..

# Copy env files and adjust as needed
cp server/.env.example server/.env
cp admin/.env.example admin/.env

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
make dev-server   # Express API only (port 8080)
make dev-admin    # Nuxt admin panel only (port 3000)
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
| Frontend   | [devcase-web](https://github.com/lucassimines/devcase-web) (Vercel) |

---

## License

Copyright © 2025–2026 Lucas Simines. All rights reserved.

Licensed under the [PolyForm Shield License 1.0.0](LICENSE).

### You may

- View, clone, and study the source code
- Run it locally for learning, evaluation, or contributing
- Submit pull requests and improvements

### You may not (without written permission)

- Offer a product or service that competes with Devcase CMS
- Resell, white-label, or sublicense this software as a commercial product

### Commercial licensing

For commercial use or a separate license agreement, open an issue on [GitHub](https://github.com/lucassimines/devcase-cms/issues) or contact the maintainer directly.

Full terms: [LICENSE](LICENSE)
