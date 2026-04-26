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

export const PAGE_ABOUT_DEFAULT = {
  profile: {
    title: '',
    title2: '',
    title3: '',
    image: ''
  }
}

export type PageAbout = typeof PAGE_ABOUT_DEFAULT
