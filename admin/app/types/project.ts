import type { Block } from '~/types/block'
import type { Solution } from '~/types/solution'
import type { Technology } from '~/types/technology'

export interface Project {
  id: string
  published: boolean
  name: string
  url?: string
  description: string
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
