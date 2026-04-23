import type { Block } from '~/types/block'

export interface Page {
  id: string
  name: string
  code: string
  slug: string
  order: number
  published: boolean
  blocks: Block[]
}

export type PageUpdate = Omit<Page, 'order'>
