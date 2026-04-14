import { prisma } from '@src/db.js'
import type { TechnologyCreateInput, TechnologyUpdateInput } from '@src/generated/prisma/models.js'

export class TechnologyRepository {
  static async findById(id: string) {
    return prisma.technology.findFirst({
      where: { id }
    })
  }

  static async create(data: TechnologyCreateInput) {
    return await prisma.technology.create({
      data
    })
  }

  static async update(id: string, data: TechnologyUpdateInput) {
    return await prisma.technology.update({
      where: { id },
      data
    })
  }

  static async deleteMany(ids: string[]) {
    return await prisma.technology.deleteMany({
      where: { id: { in: ids } }
    })
  }

  static async delete(id: string) {
    return await prisma.technology.delete({
      where: { id }
    })
  }
}
