import type { Block } from '~/types/block'

export interface Page<T = null> {
  id: string
  name: string
  code: string
  slug: string
  order: number
  published: boolean
  blocks: Block[]
  content: T
}

export type PageUpdate = Omit<Page, 'order'>

export type PageContent<T = null> = Pick<Page<T>, 'content'>

export type PageAbout = {
  profile: {
    title: string
    title2: {
      test: string
    }
    image: string
  }
}
