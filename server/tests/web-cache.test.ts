import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { webCache } from '@src/web/cache/web-cache.service.js'
import { WEB_CACHE_TAGS } from '@src/web/cache/web-cache.tags.js'

describe('webCache', () => {
  beforeEach(() => {
    process.env.WEB_CACHE_ENABLED = 'true'
  })

  afterEach(() => {
    delete process.env.WEB_CACHE_ENABLED
    webCache.flushAll()
  })

  it('returns cached entries by key', () => {
    webCache.set('GET:/api/v1/posts', {
      body: '{"data":[]}',
      statusCode: 200,
      contentType: 'application/json; charset=utf-8',
      tags: [WEB_CACHE_TAGS.posts]
    })

    expect(webCache.get('GET:/api/v1/posts')?.body).toBe('{"data":[]}')
  })

  it('flushes entries by tag without affecting other tags', () => {
    webCache.set('GET:/api/v1/posts', {
      body: '{"data":[]}',
      statusCode: 200,
      contentType: 'application/json; charset=utf-8',
      tags: [WEB_CACHE_TAGS.posts]
    })
    webCache.set('GET:/api/v1/projects', {
      body: '{"data":[]}',
      statusCode: 200,
      contentType: 'application/json; charset=utf-8',
      tags: [WEB_CACHE_TAGS.projects]
    })

    webCache.flushTags(WEB_CACHE_TAGS.posts)

    expect(webCache.get('GET:/api/v1/posts')).toBeUndefined()
    expect(webCache.get('GET:/api/v1/projects')?.body).toBe('{"data":[]}')
  })

  it('flushes only bootstrap-tagged entries', () => {
    webCache.set('GET:/api/v1/bootstrap', {
      body: '{"menu":{}}',
      statusCode: 200,
      contentType: 'application/json; charset=utf-8',
      tags: [WEB_CACHE_TAGS.bootstrap]
    })
    webCache.set('GET:/api/v1/posts', {
      body: '{"data":[]}',
      statusCode: 200,
      contentType: 'application/json; charset=utf-8',
      tags: [WEB_CACHE_TAGS.posts]
    })

    webCache.flushTags(WEB_CACHE_TAGS.bootstrap)

    expect(webCache.get('GET:/api/v1/bootstrap')).toBeUndefined()
    expect(webCache.get('GET:/api/v1/posts')?.body).toBe('{"data":[]}')
  })
})
