import { prisma } from '@src/db.js'

export interface DashboardStats {
  pages: number
  projects: number
}

export class DashboardRepository {
  static async getStats(): Promise<DashboardStats> {
    const [pages, projects] = await Promise.all([prisma.page.count(), prisma.project.count()])

    return {
      pages,
      projects
    }
  }
}
