import { webCacheConfig } from '@src/web/cache/web-cache.config.js'
import { webCache } from '@src/web/cache/web-cache.service.js'
import { WEB_CACHE_TAGS, type WebCacheTag } from '@src/web/cache/web-cache.tags.js'
import type { NextFunction, Request, Response } from 'express'

const SKIP_PATH_PREFIXES = ['/health'] as const

function shouldSkip(path: string) {
  return SKIP_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

function cacheKey(req: Request) {
  const url = new URL(req.originalUrl, 'http://cache.local')
  const params = [...url.searchParams.entries()].sort(([left], [right]) => left.localeCompare(right))
  const query = new URLSearchParams(params).toString()

  return `GET:${url.pathname}${query ? `?${query}` : ''}`
}

function resolveTags(path: string): WebCacheTag[] {
  if (path.startsWith('/bootstrap')) return [WEB_CACHE_TAGS.bootstrap]
  if (path.startsWith('/posts')) return [WEB_CACHE_TAGS.posts]
  if (path.startsWith('/projects')) return [WEB_CACHE_TAGS.projects]
  if (path.startsWith('/pages')) return [WEB_CACHE_TAGS.pages]
  if (path.startsWith('/sitemap')) return [WEB_CACHE_TAGS.sitemap]

  return []
}

export function setWebCacheControlHeaders(res: Response) {
  const { maxAge, sMaxAge, staleWhileRevalidate } = webCacheConfig

  res.setHeader(
    'Cache-Control',
    `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  )
}

export default function webCacheMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method !== 'GET' || !webCacheConfig.enabled || shouldSkip(req.path)) {
    return next()
  }

  const tags = resolveTags(req.path)

  if (!tags.length) {
    return next()
  }

  const key = cacheKey(req)
  const hit = webCache.get(key)

  if (hit) {
    res.status(hit.statusCode)
    res.setHeader('Content-Type', hit.contentType)
    setWebCacheControlHeaders(res)
    res.setHeader('X-Web-Cache', 'HIT')

    return res.send(hit.body)
  }

  const originalJson = res.json.bind(res)

  res.json = (body: unknown) => {
    setWebCacheControlHeaders(res)
    res.setHeader('X-Web-Cache', 'MISS')

    if (res.statusCode === 200) {
      webCache.set(key, {
        body: JSON.stringify(body),
        statusCode: res.statusCode,
        contentType: String(res.getHeader('Content-Type') ?? 'application/json; charset=utf-8'),
        tags
      })
    }

    return originalJson(body)
  }

  next()
}
