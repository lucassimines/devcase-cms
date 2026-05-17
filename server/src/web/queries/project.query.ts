import type { Prisma } from '@src/generated/prisma/client.js'

export const ProjectQuery = {
  published: (): Prisma.ProjectWhereInput => ({
    published: true
  }),

  orderByDisplay: (): Prisma.ProjectOrderByWithRelationInput[] => [
    { order: 'asc' },
    { slug: 'asc' }
  ]
}
