import type { Block } from '~/types/block'
import type { LocalizedString } from '~/types/locale'

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
    title: emptyLocalizedString(),
    image: emptyLocalizedString()
  }
}

export type PageAbout = typeof PAGE_ABOUT_DEFAULT

export const PAGE_HOME_DEFAULT = {
  intro: {
    title: emptyLocalizedString(),
    description: emptyLocalizedString()
  }
}

export type PageHome = typeof PAGE_HOME_DEFAULT
