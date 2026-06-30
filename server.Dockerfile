# --------------------
# Stage 1: Build
# --------------------
FROM node:24-alpine AS build-server

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY server/package*.json server/
RUN cd server && npm ci

COPY server server/

RUN cd server && npm run build


# --------------------
# Stage 2: Production runtime
# --------------------
# Debian slim (glibc) — Cursor CLI does not run reliably on Alpine/musl.
FROM node:24-bookworm-slim AS final

ARG PORT=80
ENV PORT=$PORT
ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends tini curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Cursor CLI (same as local `make generate-post`)
RUN curl https://cursor.com/install -fsS | bash

ENV PATH="/root/.local/bin:${PATH}"

RUN sh -c 'command -v cursor-agent || command -v agent || command -v cursor'

ENTRYPOINT ["/sbin/tini", "--"]

COPY --from=build-server /usr/src/app/server /usr/src/app/server

EXPOSE $PORT

CMD ["node", "server/dist/server.js"]
