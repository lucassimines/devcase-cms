import type { Block } from '~/types/block'
import type { Solution } from '~/types/solution'
import type { Technology } from '~/types/technology'

export interface Project {
  id: string
  order: number
  published: boolean
  createdAt: string
  updatedAt: string
  name: string
  url?: string
  description: string
  background: string
  image: string
  slug: string
  blocks: Block[]
  technologies: Technology[]
  solutions: Solution[]
}

export interface ProjectUpdate extends Omit<Project, 'technologies' | 'solutions'> {
  technologies: string[]
  solutions: string[]
}
