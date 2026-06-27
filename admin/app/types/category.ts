import type { LocalizedString } from '~/types/locale'

export interface Category {
  id: string
  name: LocalizedString
  type: 'POST'
  order: number
  slug: string
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export type CategoryUpdate = Category
