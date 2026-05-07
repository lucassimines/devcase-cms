import { prisma } from '@src/db.js'
import { ProjectQuery } from '@src/web/queries/project.query.js'

const CHUNK_SIZE = 100

const pageWhere = { published: true }

function paginate(page: number) {
  return { skip: (page - 1) * CHUNK_SIZE, take: CHUNK_SIZE }
}

export class SitemapService {
  static readonly chunkSize = CHUNK_SIZE

  static async getCounts() {
    const [pages, projects] = await Promise.all([
      prisma.page.count({ where: pageWhere }),
      prisma.project.count({ where: ProjectQuery.published() })
    ])

    return {
      pages: Math.max(1, Math.ceil(pages / CHUNK_SIZE)),
      projects: Math.max(1, Math.ceil(projects / CHUNK_SIZE))
    }
  }

  static async getProjects(page: number) {
    return await prisma.project.findMany({
      where: ProjectQuery.published(),
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      ...paginate(page)
    })
  }
}
