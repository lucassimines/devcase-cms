import type { Block } from '~~/shared/types/block'

export interface Project {
  id: number
  published: boolean
  name: string
  url: string
  description: string
  image: string
  slug: string
  blocks: Block[]
}
