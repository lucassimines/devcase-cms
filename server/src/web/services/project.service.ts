import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import { paginate } from '@src/utils/paginate.utils.js'

const ProjectQuery = {
  published: (): Prisma.ProjectWhereInput => ({
    published: true
  }),

  orderByPosition: (): Prisma.ProjectOrderByWithRelationInput => ({
    order: 'asc'
  })
}

export class ProjectService {
  static featured() {
    return prisma.project.findMany({
      where: ProjectQuery.published(),
      orderBy: ProjectQuery.orderByPosition(),
      select: {
        id: true,
        slug: true,
        name: true,
        image: true
      },
      take: 4
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
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  }
}
