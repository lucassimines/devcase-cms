# --------------------
# Stage 1: Build
# --------------------
    FROM node:24-alpine AS build-server

    WORKDIR /usr/src/app
    
    RUN apk add --no-cache openssl
    
    # Copy only what is needed for install first (better cache)
    COPY server/package*.json server/
    RUN cd server && npm ci
    
    # Copy the rest of the source
    COPY server server/
    
    # Build
    RUN cd server && npm run build
    
    
    # --------------------
    # Stage 2: Production runtime
    # --------------------
    FROM node:24-alpine AS final
    
    ARG PORT=80
    ENV PORT=$PORT
    ENV NODE_ENV=production
    
    WORKDIR /usr/src/app
    
    RUN apk add --no-cache \
        tini \
        openssl \
        curl \
        bash \
        ca-certificates

    # Cursor CLI (same as local `make generate-post`)
    RUN curl https://cursor.com/install -fsS | bash

    ENV PATH="/root/.local/bin:${PATH}"
    
    ENTRYPOINT ["/sbin/tini", "--"]
    
    # Copy built output + node_modules
    COPY --from=build-server /usr/src/app/server /usr/src/app/server
    
    EXPOSE $PORT
    
    CMD ["node", "server/dist/server.js"]
