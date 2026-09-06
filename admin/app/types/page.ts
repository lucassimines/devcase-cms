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

export const PAGE_HOME_DEFAULT = {
  intro: {
    title: emptyLocalizedString(),
    description: emptyLocalizedString()
  },
  projects: {
    title: emptyLocalizedString(),
    cta_text: emptyLocalizedString()
  },
  tools: {
    title: emptyLocalizedString(),
    cta_text: emptyLocalizedString()
  },
  priceflip: {
    heading: {
      title: emptyLocalizedString()
    },
    badge: emptyLocalizedString(),
    title: emptyLocalizedString(),
    description: emptyLocalizedString(),
    cta_text: emptyLocalizedString(),
    image: emptyLocalizedString()
  }
}

export type PageHome = typeof PAGE_HOME_DEFAULT

export const PAGE_TOOLS_DEFAULT = {
  intro: {
    title: emptyLocalizedString(),
    description: emptyLocalizedString()
  }
}

export type PageTools = typeof PAGE_TOOLS_DEFAULT

export const PRICEFLIP_TEXT_ITEM_DEFAULT = {
  title: emptyLocalizedString(),
  description: emptyLocalizedString()
}

export const PRICEFLIP_FAQ_ITEM_DEFAULT = {
  question: emptyLocalizedString(),
  answer: emptyLocalizedString()
}

export const PAGE_PRICEFLIP_DEFAULT = {
  seo: {
    title: emptyLocalizedString(),
    description: emptyLocalizedString(),
    keywords: emptyLocalizedString()
  },
  hero: {
    badge: emptyLocalizedString(),
    title: emptyLocalizedString(),
    subtitle: emptyLocalizedString(),
    description: emptyLocalizedString(),
    image: emptyLocalizedString()
  },
  highlights: [] as Array<typeof PRICEFLIP_TEXT_ITEM_DEFAULT>,
  how_it_works: {
    title: emptyLocalizedString(),
    items: [] as Array<typeof PRICEFLIP_TEXT_ITEM_DEFAULT>
  },
  features: {
    title: emptyLocalizedString(),
    items: [] as Array<typeof PRICEFLIP_TEXT_ITEM_DEFAULT>
  },
  download: {
    title: emptyLocalizedString(),
    description: emptyLocalizedString(),
    ios_label: emptyLocalizedString(),
    android_label: emptyLocalizedString(),
    android_soon: emptyLocalizedString(),
    ios_url: '',
    android_url: ''
  },
  faq: {
    title: emptyLocalizedString(),
    items: [] as Array<typeof PRICEFLIP_FAQ_ITEM_DEFAULT>
  },
  privacy_label: emptyLocalizedString()
}

export type PagePriceFlip = typeof PAGE_PRICEFLIP_DEFAULT
