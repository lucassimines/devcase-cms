import type { LocalizedString } from '~/types/locale'

export type CategoryType = 'POST'

export interface Category {
  id: string
  name: LocalizedString
  type: CategoryType
  order: number
  slug: string
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export type CategoryUpdate = Category
