import { prisma } from '@src/db.js'
import type { SolutionCreateInput, SolutionUpdateInput } from '@src/generated/prisma/models.js'
import { createAtTopOrder } from '@src/utils/order.utils.js'

export class SolutionRepository {
  static all() {
    return prisma.solution.findMany()
  }

  static findById(id: string) {
    return prisma.solution.findFirst({
      where: { id }
    })
  }

  static create(data: SolutionCreateInput) {
    return createAtTopOrder('solution', data)
  }

  static update(id: string, data: SolutionUpdateInput) {
    return prisma.solution.update({
      where: { id },
      data
    })
  }

  static deleteMany(ids: string[]) {
    return prisma.solution.deleteMany({
      where: { id: { in: ids } }
    })
  }

  static delete(id: string) {
    return prisma.solution.delete({
      where: { id }
    })
  }
}
