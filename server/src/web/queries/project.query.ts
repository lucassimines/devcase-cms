import type { Prisma } from '@src/generated/prisma/client.js'

export const ProjectQuery = {
  published: (): Prisma.ProjectWhereInput => ({
    published: true
  }),

  orderByPosition: (): Prisma.ProjectOrderByWithRelationInput => ({
    order: 'asc'
  })
}
