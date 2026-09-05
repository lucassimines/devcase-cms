---
name: cms-server
description: Express 5 + Prisma 7 API for Devcase CMS — admin CRUD, public headless routes, cache, auth, and tests. Use when adding endpoints, models, repositories, or changing public JSON.
---

# CMS server

Package: `server/`. ESM (`"type": "module"`). Import with `.js` extensions and `@src/` aliases.

## Layout

| Path | Role |
| --- | --- |
| `src/app.ts` | CORS, JSON body, static `/static`, mount routers |
| `src/admin/routes` | Authenticated CRUD (`/api/v1/admin/*`) |
| `src/web/routes` | Public GET (`/api/v1/pages`, `projects`, `posts`, `bootstrap`, `sitemap`) |
| `src/admin/repositories` | Prisma access for admin |
| `src/web/services` + `queries` | Public reads |
| `src/errors` | `HttpError` subclasses; `error.middleware` returns `{ message }` |
| `prisma/schema.prisma` | PostgreSQL; client output `src/generated/prisma` |

`API_BASE_PATH` prefixes all routes (typically `/api/v1`).

Auth router is `/auth` (not under `/admin`). Admin router uses `VerifyApiTokenMiddleware` then `requestContext` with `userId`.

## Adding an admin resource

1. Prisma model + migration (`make prisma-new-migration` / `make prisma-migrate`). Never edit generated client by hand.
2. Repository (see `page.repository.ts`): class with static methods, `paginate` / `reorder` / `createAtTopOrder` when ordered.
3. Controller: thin `req`/`res.json`.
4. Router: `reorder` before `/:id`. `deleteMany` on `DELETE /`.
5. Mount in `admin/routes/index.ts`.
6. Flush the right cache group from the Prisma hook or repository path (`WebCacheInvalidation`).
7. Tests under `server/tests` (Vitest + supertest for HTTP).

## Public API

- Only published content belongs on `web/` queries.
- Cache: `webCacheMiddleware` + tags in `web-cache.tags.ts`. Invalidation groups in `web-cache.invalidation.ts` also refresh sitemap via `RevalidateService`.
- Adding a public collection: route + controller + service/query + cache tag + sitemap if the URL is public.

## Localized JSON

Translatable columns are Prisma `Json`. Shape `{ "en-US": "", "pt-BR": "" }`. Helpers: `localized-json.utils.ts`, `locale.utils.ts`. Keep both keys. Frontend default locale is pt-BR; server helpers often treat `en-US` as primary when coercing strings — always persist both.

## Prisma 7

`PrismaClient` uses `@prisma/adapter-pg` and `DATABASE_URL`. Export `prisma` (extended: request scope + web cache) vs `prismaRaw` from `db.ts`.

## Commands

- Dev: `make dev-server` or `npm run dev` in `server/`.
- Tests: `npm test` in `server/`.
- Schema: Makefile `prisma-*` targets. Docker Postgres via `make up`.
