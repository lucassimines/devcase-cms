import type { Block } from '~/types/block'
import type { LocalizedString } from '~/utils/locale.utils'

export interface Page<T = null> {
  id: string
  name: LocalizedString
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
    image: ''
  }
}

export type PageAbout = typeof PAGE_ABOUT_DEFAULT

export const PAGE_HOME_DEFAULT = {
  intro: {
    title: '',
    description: ''
  }
}

export type PageHome = typeof PAGE_HOME_DEFAULT
