import { prisma } from '@src/db.js'
import type { TechnologyCreateInput, TechnologyUpdateInput } from '@src/generated/prisma/models.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'

export class TechnologyRepository {
  static all() {
    return prisma.technology.findMany()
  }

  static findById(id: string) {
    return prisma.technology.findFirst({
      where: { id }
    })
  }

  static async create(data: TechnologyCreateInput) {
    const technology = await prisma.technology.create({
      data
    })

    WebCacheInvalidation.projects()

    return technology
  }

  static async update(id: string, data: TechnologyUpdateInput) {
    const technology = await prisma.technology.update({
      where: { id },
      data
    })

    WebCacheInvalidation.projects()

    return technology
  }

  static async deleteMany(ids: string[]) {
    const result = await prisma.technology.deleteMany({
      where: { id: { in: ids } }
    })

    WebCacheInvalidation.projects()

    return result
  }

  static async delete(id: string) {
    const result = await prisma.technology.delete({
      where: { id }
    })

    WebCacheInvalidation.projects()

    return result
  }
}
