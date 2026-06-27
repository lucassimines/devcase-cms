import type { LocalizedString } from '~/types/locale'

export interface Post {
  id: string
  order: number
  published: boolean
  name: LocalizedString
  excerpt: LocalizedString
  content: LocalizedString
  image: LocalizedString
  slug: string
  createdAt: string
  updatedAt: string
}

export type PostUpdate = Post
