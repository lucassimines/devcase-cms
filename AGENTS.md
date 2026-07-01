# AGENTS.md

## Cursor Cloud specific instructions

This repo is a headless CMS with two dev services. Standard commands live in `README.md`, `Makefile`, `server/package.json`, and `admin/package.json`; the notes below only cover non-obvious caveats for this cloud environment.

### Services
| Service | Dir | Dev command | Port | Notes |
| --- | --- | --- | --- | --- |
| Admin panel (Nuxt 4 SPA) | `admin/` | `npm run dev` | 3000 | Talks to API at `API_BASE_URL` from `admin/.env` |
| API (Express) | `server/` | `npm run dev` | 8080 | `dev` runs `prisma generate` then `tsx watch`; health: `GET /api/v1/health` |

Docker Compose also defines `redis` and `mailpit`, but neither is referenced in `server/src`, so they are **not** required to run or test the app in this environment.

### Database (no Docker here)
- Postgres runs natively (apt PostgreSQL 16), not via `make up`/Docker. **It is not auto-started** — start it each session:
  `sudo pg_ctlcluster 16 main start`
- `pg_hba.conf` is set to `trust` for local + loopback, so the example URL `postgresql://postgres:root@localhost:5432/postgres` works (password ignored).
- Apply schema with `cd server && npx prisma migrate deploy`. Server `npm test` auto-creates the `devcase_test` DB and applies migrations (Postgres must be running).

### Node version
- The project requires Node 24+. An `/exec-daemon/node` shim (v22) sits ahead of nvm on `PATH`; `~/.bashrc` prepends the Node 24 bin so `node` resolves to v24 in login shells. Run commands via a login shell (e.g. `bash -l`) so the correct Node is used.

### Env files
- `server/.env` and `admin/.env` are gitignored and already created from the `.env.example` files (JWT secrets filled, `FRONTEND_URL=http://localhost:3000`). They persist via the VM snapshot.

### Gotchas
- `npm` here uses an `allow-scripts` policy that prints `npm warn allow-scripts ...` and skips dependency install scripts. This is harmless: prisma, esbuild, and sharp work via prebuilt binaries and `prisma generate` / `npm run dev`. Do not try to "fix" these warnings interactively.
- The DB seed (`server/prisma/seed.ts`) is broken — it uses `bcrypt` without importing it, so `prisma db seed` fails. Create users via `POST /api/v1/auth/signup` (`{name,email,password}`) instead.
- Pre-existing app bug (unrelated to env): the admin panel sends localized JSON for names, but `Technology.name` is `String` in `prisma/schema.prisma`, so creating a Technology via the admin UI 500s. Other content types (Page, Project, Post, Solution) use `Json` and work.
