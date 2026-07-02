import { SitemapService } from '@src/web/services/sitemap.service.js'
import type { Request, Response } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'
import { createGzip } from 'zlib'

const cache = new Map<string, { data: Buffer; timestamp: number }>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

const TYPES = ['pages', 'posts', 'projects'] as const

const { FRONTEND_URL } = process.env

type SitemapType = (typeof TYPES)[number]

function getCached(key: string) {
  const entry = cache.get(key)

  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data
  }

  return
}

function setCache(key: string, data: Buffer) {
  cache.set(key, { data, timestamp: Date.now() })
}

export function clearSitemapCache() {
  cache.clear()
}

function xmlHeaders(res: Response) {
  res.header('Content-Type', 'application/xml')
  res.header('Content-Encoding', 'gzip')
  res.header('Cache-Control', 'public, max-age=3600, s-maxage=3600')
}

function parseName(name: string): { type: SitemapType; page: number } | undefined {
  const clean = name.replace(/\.xml$/, '')

  const match = clean.match(new RegExp(`^(${TYPES.join('|')})-(\\d+)$`))

  if (!match) return

  const page = parseInt(match[2], 10)

  if (!page) return

  return { type: match[1] as SitemapType, page }
}

export class SitemapController {
  /** GET /sitemap — sitemap index */
  static async index(_req: Request, res: Response) {
    xmlHeaders(res)

    const cached = getCached('index')
    if (cached) return res.send(cached)

    try {
      const counts = await SitemapService.getCounts()

      const entries: string[] = []

      for (const type of TYPES) {
        for (let i = 1; i <= counts[type]; i++) {
          entries.push(`  <sitemap><loc>${FRONTEND_URL}/sitemap/${type}-${i}.xml</loc></sitemap>`)
        }
      }

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...entries,
        '</sitemapindex>'
      ].join('\n')

      const gzip = createGzip()

      gzip.end(xml)

      const buf = await streamToPromise(gzip)

      setCache('index', buf)

      res.send(buf)
    } catch (e) {
      console.error(e)
      res.status(500).end()
    }
  }

  /** GET /sitemap/:name — individual chunk (pages-1, posts-2, etc.) */
  static async show(req: Request, res: Response) {
    const parsed = parseName(
      Array.isArray(req.params.name) ? req.params.name[0] : req.params.name || ''
    )

    if (!parsed) return res.status(404).end()

    const cacheKey = `${parsed.type}-${parsed.page}`

    xmlHeaders(res)

    const cached = getCached(cacheKey)
    if (cached) return res.send(cached)

    try {
      const hostname = FRONTEND_URL

      if (!FRONTEND_URL) {
        throw new Error('FRONTEND_URL is not defined')
      }

      const smStream = new SitemapStream({ hostname })
      const pipeline = smStream.pipe(createGzip())

      const writers: Record<SitemapType, (stream: SitemapStream, page: number) => Promise<void>> = {
        pages: SitemapController.writePages,
        posts: SitemapController.writePosts,
        projects: SitemapController.writeProjects
      }

      await writers[parsed.type](smStream, parsed.page)
      smStream.end()

      const buf = await streamToPromise(pipeline)
      setCache(cacheKey, buf)

      res.send(buf)
    } catch (e) {
      console.error(e)
      res.status(500).end()
    }
  }

  static async writePages(stream: SitemapStream, page: number) {
    const pages = await SitemapService.getPages(page)

    for (const pageItem of pages) {
      const slug = pageItem.slug === 'home' ? '' : pageItem.slug

      stream.write({
        url: `/${slug}`,
        lastmod: pageItem.updatedAt.toISOString(),
        changefreq: 'monthly',
        priority: pageItem.slug === 'home' ? 1.0 : 0.8
      })
    }
  }

  static async writePosts(stream: SitemapStream, page: number) {
    const posts = await SitemapService.getPosts(page)

    for (const post of posts) {
      stream.write({
        url: `/articles/${post.slug}`,
        lastmod: post.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      })
    }
  }

  static async writeProjects(stream: SitemapStream, page: number) {
    const projects = await SitemapService.getProjects(page)

    for (const project of projects) {
      stream.write({
        url: `/projects/${project.slug}`,
        lastmod: project.updatedAt.toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      })
    }
  }
}
