import { LRUCache } from 'lru-cache'

import { webCacheConfig } from './web-cache.config.js'
import type { WebCacheTag } from './web-cache.tags.js'

export type WebCacheEntry = {
  body: string
  statusCode: number
  contentType: string
  tags: WebCacheTag[]
}

class WebCacheService {
  private readonly cache = new LRUCache<string, WebCacheEntry>({
    max: webCacheConfig.maxEntries,
    ttl: webCacheConfig.ttlMs
  })

  private readonly tagIndex = new Map<WebCacheTag, Set<string>>()

  get(key: string) {
    if (!webCacheConfig.enabled) return

    return this.cache.get(key)
  }

  set(key: string, entry: WebCacheEntry) {
    if (!webCacheConfig.enabled) return

    const previous = this.cache.get(key)

    if (previous) {
      this.unindexKey(key, previous.tags)
    }

    this.cache.set(key, entry)
    this.indexKey(key, entry.tags)
  }

  flushTags(...tags: WebCacheTag[]) {
    if (!webCacheConfig.enabled) return

    const keys = new Set<string>()

    for (const tag of tags) {
      const taggedKeys = this.tagIndex.get(tag)

      if (!taggedKeys) continue

      for (const key of taggedKeys) {
        keys.add(key)
      }
    }

    for (const key of keys) {
      const entry = this.cache.get(key)

      if (entry) {
        this.unindexKey(key, entry.tags)
      }

      this.cache.delete(key)
    }
  }

  flushAll() {
    if (!webCacheConfig.enabled) return

    this.cache.clear()
    this.tagIndex.clear()
  }

  private indexKey(key: string, tags: WebCacheTag[]) {
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag) ?? new Set<string>()

      keys.add(key)
      this.tagIndex.set(tag, keys)
    }
  }

  private unindexKey(key: string, tags: WebCacheTag[]) {
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag)

      if (!keys) continue

      keys.delete(key)

      if (!keys.size) {
        this.tagIndex.delete(tag)
      }
    }
  }
}

export const webCache = new WebCacheService()
