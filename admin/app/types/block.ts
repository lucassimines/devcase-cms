import type { LocalizedString } from '~/types/locale'

export const blockType = {
  TEXT: 'text',
  IMAGE: 'image',
  WEB: 'web',
  TEXT_IMAGE: 'text_image'
} as const

export type BlockType = (typeof blockType)[keyof typeof blockType]

export interface TextBlock {
  text: LocalizedString
}

export interface ImageBlock {
  image: LocalizedString
}

export interface WebBlock {
  image: {
    desktop: LocalizedString
    mobile: LocalizedString
  }
}

export interface TextImageBlock {
  image: LocalizedString
  title: LocalizedString
  text: LocalizedString
  textPosition: 'left' | 'right'
}

type BlockMap = {
  text: TextBlock
  web: WebBlock
  image: ImageBlock
  text_image: TextImageBlock
}

export type Block = {
  [K in keyof BlockMap]: {
    type: K
    content: BlockMap[K]
  }
}[keyof BlockMap]
