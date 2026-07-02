import { prisma } from '@src/db.js'
import type { SolutionCreateInput, SolutionUpdateInput } from '@src/generated/prisma/models.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'
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

  static async create(data: SolutionCreateInput) {
    const solution = await createAtTopOrder('solution', data)

    WebCacheInvalidation.projects()

    return solution
  }

  static async update(id: string, data: SolutionUpdateInput) {
    const solution = await prisma.solution.update({
      where: { id },
      data
    })

    WebCacheInvalidation.projects()

    return solution
  }

  static async deleteMany(ids: string[]) {
    const result = await prisma.solution.deleteMany({
      where: { id: { in: ids } }
    })

    WebCacheInvalidation.projects()

    return result
  }

  static async delete(id: string) {
    const result = await prisma.solution.delete({
      where: { id }
    })

    WebCacheInvalidation.projects()

    return result
  }
}
