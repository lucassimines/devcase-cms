function readInt(name: string, fallback: number) {
  const value = process.env[name]

  if (!value) return fallback

  const parsed = Number.parseInt(value, 10)

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function readBool(name: string, fallback: boolean) {
  const value = process.env[name]

  if (value === undefined) return fallback

  return value === '1' || value.toLowerCase() === 'true'
}

export const webCacheConfig = {
  get enabled() {
    return readBool('WEB_CACHE_ENABLED', process.env.NODE_ENV !== 'test')
  },
  maxEntries: readInt('WEB_CACHE_MAX_ENTRIES', 500),
  ttlMs: readInt('WEB_CACHE_TTL_MS', 300_000),
  maxAge: readInt('WEB_CACHE_MAX_AGE', 60),
  sMaxAge: readInt('WEB_CACHE_S_MAXAGE', 300),
  staleWhileRevalidate: readInt('WEB_CACHE_STALE_WHILE_REVALIDATE', 600)
} as const
