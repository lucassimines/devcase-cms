import { prisma } from '@src/db.js'
import { CategoryType } from '@src/generated/prisma/client.js'
import { PageQuery } from '@src/web/queries/page.query.js'
import { PostQuery } from '@src/web/queries/post.query.js'
import { ProjectQuery } from '@src/web/queries/project.query.js'

const CHUNK_SIZE = 100

function paginate(page: number) {
  return { skip: (page - 1) * CHUNK_SIZE, take: CHUNK_SIZE }
}

export class SitemapService {
  static readonly chunkSize = CHUNK_SIZE

  static async getCounts() {
    const [pages, posts, projects, postCategories] = await Promise.all([
      prisma.page.count({ where: PageQuery.published() }),
      prisma.post.count({ where: PostQuery.published() }),
      prisma.project.count({ where: ProjectQuery.published() }),
      prisma.category.count({ where: { type: CategoryType.POST } })
    ])

    return {
      pages: Math.max(1, Math.ceil(pages / CHUNK_SIZE)),
      posts: Math.max(1, Math.ceil(posts / CHUNK_SIZE)),
      projects: Math.max(1, Math.ceil(projects / CHUNK_SIZE)),
      'post-categories': Math.max(1, Math.ceil(postCategories / CHUNK_SIZE))
    }
  }

  static async getPages(page: number) {
    return await prisma.page.findMany({
      where: PageQuery.published(),
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      ...paginate(page)
    })
  }

  static async getPosts(page: number) {
    return await prisma.post.findMany({
      where: PostQuery.published(),
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      ...paginate(page)
    })
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

  static async getPostCategories(page: number) {
    return await prisma.category.findMany({
      where: { type: CategoryType.POST },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      ...paginate(page)
    })
  }
}
