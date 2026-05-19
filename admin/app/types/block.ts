export const blockType = {
  TEXT: 'text',
  IMAGE: 'image',
  WEB: 'web',
  TEXT_IMAGE: 'text_image'
} as const

export type BlockType = (typeof blockType)[keyof typeof blockType]

export interface TextBlock {
  text: string
}

export interface ImageBlock {
  image: string
}

export interface WebBlock {
  image: {
    desktop: string
    mobile: string
  }
}

export interface TextImageBlock {
  image: string
  title: string
  text: string
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
