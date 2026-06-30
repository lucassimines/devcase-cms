import type { LocalizedJson } from '@src/utils/localized-json.utils.js'

export type GeneratedPostContent = {
  name: LocalizedJson
  excerpt: LocalizedJson
  content: LocalizedJson
}

export type GeneratePostOptions = {
  topic: string
  keywords?: string[]
  tone?: string
}

export type SavePostOptions = {
  slug?: string
  published?: boolean
  categorySlugs?: string[]
}

export type SavedPostResult = {
  id: string
  slug: string
  published: boolean
  categorySlugs: string[]
}
