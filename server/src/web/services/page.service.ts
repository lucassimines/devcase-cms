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
  static async menuPages() {
    const pages = await prisma.page.findMany({
      where: PageQuery.published(),
      orderBy: PageQuery.orderByPosition(),
      select: {
        id: true,
        name: true,
        slug: true
      }
    })

    // Replace home slug
    pages.forEach((page) => {
      if (page.slug === 'home') {
        page.slug = ''
      }
    })

    return pages
  }

  static async findBySlug(slug: string) {
    return prisma.page.findFirst({
      where: { slug, ...PageQuery.published() },
      omit: {
        published: true
      }
    })
  }
}
