import { prisma } from '@src/db.js'

export interface DashboardStats {
  pages: number
  projects: number
  posts: number
}

export class DashboardRepository {
  static async getStats(): Promise<DashboardStats> {
    const [pages, projects, posts] = await Promise.all([
      prisma.page.count(),
      prisma.project.count(),
      prisma.post.count()
    ])

    return {
      pages,
      projects,
      posts
    }
  }
}
