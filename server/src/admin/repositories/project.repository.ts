import { prisma } from '@src/db.js'
import type { ProjectCreateInput, ProjectUpdateInput } from '@src/generated/prisma/models.js'

export class ProjectRepository {
  static async findById(id: string) {
    return prisma.project.findFirst({
      where: { id }
    })
  }

  static async create(data: ProjectCreateInput) {
    return await prisma.project.create({
      data
    })
  }

  static async update(id: string, data: ProjectUpdateInput) {
    return await prisma.project.update({
      where: { id },
      data
    })
  }

  static async deleteMany(ids: string[]) {
    return await prisma.project.deleteMany({
      where: { id: { in: ids } }
    })
  }

  static async delete(id: string) {
    return await prisma.project.delete({
      where: { id }
    })
  }
}
