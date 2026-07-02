import { prisma } from '@src/db.js'
import type { TechnologyCreateInput, TechnologyUpdateInput } from '@src/generated/prisma/models.js'

export class TechnologyRepository {
  static all() {
    return prisma.technology.findMany()
  }

  static findById(id: string) {
    return prisma.technology.findFirst({
      where: { id }
    })
  }

  static create(data: TechnologyCreateInput) {
    return prisma.technology.create({
      data
    })
  }

  static update(id: string, data: TechnologyUpdateInput) {
    return prisma.technology.update({
      where: { id },
      data
    })
  }

  static deleteMany(ids: string[]) {
    return prisma.technology.deleteMany({
      where: { id: { in: ids } }
    })
  }

  static delete(id: string) {
    return prisma.technology.delete({
      where: { id }
    })
  }
}
