import { clearSitemapCache } from '@src/web/controllers/sitemap.controller.js'
import { webCache } from '@src/web/cache/web-cache.service.js'
import { WEB_CACHE_TAGS, type WebCacheTag } from '@src/web/cache/web-cache.tags.js'

const INVALIDATION_GROUPS = {
  posts: [WEB_CACHE_TAGS.posts, WEB_CACHE_TAGS.bootstrap, WEB_CACHE_TAGS.sitemap],
  projects: [WEB_CACHE_TAGS.projects, WEB_CACHE_TAGS.bootstrap, WEB_CACHE_TAGS.sitemap],
  pages: [WEB_CACHE_TAGS.pages, WEB_CACHE_TAGS.bootstrap, WEB_CACHE_TAGS.sitemap],
  bootstrap: [WEB_CACHE_TAGS.bootstrap, WEB_CACHE_TAGS.sitemap]
} as const satisfies Record<string, WebCacheTag[]>

function flush(tags: readonly WebCacheTag[]) {
  webCache.flushTags(...tags)

  if (tags.includes(WEB_CACHE_TAGS.sitemap)) {
    clearSitemapCache()
  }
}

export const WebCacheInvalidation = {
  posts: () => flush(INVALIDATION_GROUPS.posts),
  projects: () => flush(INVALIDATION_GROUPS.projects),
  pages: () => flush(INVALIDATION_GROUPS.pages),
  bootstrap: () => flush(INVALIDATION_GROUPS.bootstrap),
  all: () => {
    webCache.flushAll()
    clearSitemapCache()
  }
}
