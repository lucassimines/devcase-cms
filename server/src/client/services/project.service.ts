import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'

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
        image: true,
        order: true
      },
      take: 3
    })
  }
}
