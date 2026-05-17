import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { ProjectQuery } from '@src/web/queries/project.query.js'

export class ProjectService {
  static featured() {
    return prisma.project.findMany({
      where: ProjectQuery.published(),
      orderBy: ProjectQuery.orderByPosition(),
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
      orderBy: ProjectQuery.orderByPosition()
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

  static async findProjectByOrder(order: number) {
    return prisma.project.findFirst({
      where: { order },
      select: {
        id: true,
        name: true,
        slug: true
      }
    })
  }
}
