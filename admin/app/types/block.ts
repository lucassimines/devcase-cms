export const blockType = {
  TEXT: 'text',
  IMAGE: 'image'
} as const

export type BlockType = (typeof blockType)[keyof typeof blockType]

export interface TextBlock {
  text: string
}

export interface ImageBlock {
  image: string
}

type BlockMap = {
  text: TextBlock
  image: ImageBlock
}

export type Block = {
  [K in keyof BlockMap]: {
    id: number
    type: K
    content: BlockMap[K]
  }
}[keyof BlockMap]
