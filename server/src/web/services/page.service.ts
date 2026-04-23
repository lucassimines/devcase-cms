import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'

const PageQuery = {
  published: (): Prisma.PageWhereInput => ({
    published: true
  }),

  orderByPosition: (): Prisma.PageOrderByWithRelationInput => ({
    order: 'asc'
  })
}

export class PageService {
  static async findBySlug(slug: string) {
    return prisma.page.findFirst({
      where: { slug, ...PageQuery.published() }
    })
  }
}
