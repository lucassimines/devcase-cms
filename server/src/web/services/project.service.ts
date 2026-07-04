import { prisma } from '@src/db.js'
import type { ProjectSelect } from '@src/generated/prisma/models.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { ProjectQuery } from '@src/web/queries/project.query.js'
import type { Request } from 'express'

const PROJECTS_PER_PAGE = 12

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

  static paginatedList(query: Request['query'] = {}) {
    return paginate(
      prisma.project,
      {
        ...query,
        limit: Number(query.limit ?? PROJECTS_PER_PAGE),
        orderBy: ProjectQuery.orderByPosition()
      },
      {
        where: ProjectQuery.published()
      }
    )
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

  /** Next published project in display order; wraps to the first when last. */
  static async findNextProject(order: number, slug: string) {
    const select: ProjectSelect = {
      id: true,
      name: true,
      slug: true
    }

    const next = await prisma.project.findFirst({
      where: {
        ...ProjectQuery.published(),
        OR: [{ order: { gt: order } }, { order: order, slug: { gt: slug } }]
      },
      orderBy: ProjectQuery.orderByDisplay(),
      select
    })

    if (next) return next

    return prisma.project.findFirst({
      where: ProjectQuery.published(),
      orderBy: ProjectQuery.orderByDisplay(),
      select
    })
  }
}
