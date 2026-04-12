export const blockType = {
  TEXT: 'text',
  IMAGE: 'image',
  WEB: 'web'
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

type BlockMap = {
  text: TextBlock
  web: WebBlock
  image: ImageBlock
}

export type Block = {
  [K in keyof BlockMap]: {
    type: K
    content: BlockMap[K]
  }
}[keyof BlockMap]
