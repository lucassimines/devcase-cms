import { prisma } from '@src/db.js'
import { PageQuery } from '@src/web/queries/page.query.js'

export class PageService {
  static async menuPages() {
    const pages = await prisma.page.findMany({
      where: PageQuery.published(),
      orderBy: PageQuery.orderByDisplay(),
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
