# Project Setup

Standard patterns for new Nuxt projects: CI, ESLint, package scripts.

## CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: {node-version: 24, cache: npm}
      - run: npm ci
      - run: npm run prepare
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test # if tests exist
```

**With env vars:**

```yaml
env:
  DATABASE_URL: postgresql://test:test@localhost:5432/test
  API_KEY: test
```

## ESLint Config

```js
// eslint.config.mjs
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    vue: true,
    ignores: ['.eslintcache', 'cache/**', '.claude/**', 'README.md', 'docs/**'],
  }),
)
```

**For monorepos, add:**

```js
ignores: ['apps/web/.nuxt/**', 'packages/**/dist/**']
```

## Package Scripts

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "prepare": "nuxt prepare",
    "lint": "eslint . --cache",
    "lint:fix": "eslint . --fix --cache",
    "typecheck": "nuxt typecheck"
  }
}
```

## Key Conventions

| Convention      | Standard                                              |
| --------------- | ----------------------------------------------------- |
| Package manager | npm with `npm ci` in CI                               |
| Node version    | 24+                                                   |
| ESLint base     | @antfu/eslint-config                                  |
| Formatter       | Via ESLint (`formatters: true`), no separate Prettier |
| Cache           | `--cache` flag on lint scripts                        |
| Prepare step    | Required before lint/typecheck in CI                  |

## NuxtHub Deployment

```yaml
# .github/workflows/nuxthub.yml
name: Deploy to NuxtHub
on: push

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions: {contents: read, id-token: write}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: {node-version: 24, cache: npm}
      - run: npm ci
      - uses: nuxt-hub/action@v2
        with:
          project-key: your-project-key
```

> **For release workflows and tsconfig patterns:** see `ts-library` skill
