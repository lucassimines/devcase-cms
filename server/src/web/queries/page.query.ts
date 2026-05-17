import type { Prisma } from '@src/generated/prisma/client.js'

export const PageQuery = {
  published: (): Prisma.PageWhereInput => ({
    published: true
  }),

  orderByDisplay: (): Prisma.PageOrderByWithRelationInput[] => [{ order: 'asc' }, { slug: 'asc' }]
}
