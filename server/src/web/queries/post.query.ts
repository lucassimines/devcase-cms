import type { Prisma } from '@src/generated/prisma/client.js'

export const PostQuery = {
  published: (): Prisma.PostWhereInput => ({
    published: true
  }),

  orderByPosition: (): Prisma.PostOrderByWithRelationInput => ({
    order: 'asc'
  }),

  orderByDisplay: (): Prisma.PostOrderByWithRelationInput[] => [
    { order: 'asc' },
    { slug: 'asc' }
  ]
}
