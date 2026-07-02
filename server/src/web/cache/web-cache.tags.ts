export const WEB_CACHE_TAGS = {
  bootstrap: 'bootstrap',
  posts: 'posts',
  projects: 'projects',
  pages: 'pages',
  sitemap: 'sitemap'
} as const

export type WebCacheTag = (typeof WEB_CACHE_TAGS)[keyof typeof WEB_CACHE_TAGS]
