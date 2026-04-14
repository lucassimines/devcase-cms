import type { Block } from '~/types/block'
import type { Technology } from '~/types/technology'

export interface Project {
  id: string
  published: boolean
  name: string
  url: string
  description: string
  image: string
  slug: string
  blocks: Block[]
  technologies: Technology[]
}

export interface ProjectUpdate extends Omit<Project, 'technologies'> {
  technologies: string[]
}
