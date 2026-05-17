import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { ProjectQuery } from '@src/web/queries/project.query.js'

export class ProjectService {
  static featured() {
    return prisma.project.findMany({
      where: ProjectQuery.published(),
      orderBy: ProjectQuery.orderByDisplay(),
      select: {
        id: true,
        slug: true,
        name: true,
        background: true,
        image: true
      },
      take: 2
    })
  }

  static paginatedList() {
    return paginate(prisma.project, {
      where: ProjectQuery.published(),
      orderBy: ProjectQuery.orderByDisplay()
    })
  }

  static async findBySlug(slug: string) {
    return prisma.project.findFirst({
      where: { slug, ...ProjectQuery.published() },
      include: {
        technologies: {
          select: {
            id: true,
            name: true,
            url: true
          }
        },
        solutions: {
          orderBy: {
            order: 'asc'
          },
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  }

  /** Next published project in display order, or null if last / slug not found. */
  static async findNextProject(order: number, slug: string) {
    return prisma.project.findFirst({
      where: {
        ...ProjectQuery.published(),
        OR: [{ order: { gt: order } }, { order: order, slug: { gt: slug } }]
      },
      orderBy: ProjectQuery.orderByDisplay(),
      select: {
        id: true,
        name: true,
        slug: true
      }
    })
  }
}
