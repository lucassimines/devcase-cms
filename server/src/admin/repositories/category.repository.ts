import { prisma } from '@src/db.js'
import type { CategoryType } from '@src/generated/prisma/client.js'
import type { CategoryCreateInput, CategoryUpdateInput } from '@src/generated/prisma/models.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'
import { createAtTopOrder } from '@src/utils/order.utils.js'

export class CategoryRepository {
  static findById(id: string, type: CategoryType) {
    return prisma.category.findFirst({
      where: { id, type }
    })
  }

  static all(type: CategoryType) {
    return prisma.category.findMany({
      where: { type },
      orderBy: { order: 'asc' }
    })
  }

  static async create(data: CategoryCreateInput) {
    const category = await createAtTopOrder('category', data)

    if (data.type === 'POST') {
      WebCacheInvalidation.posts()
    }

    return category
  }

  static async update(id: string, type: CategoryType, data: CategoryUpdateInput) {
    const category = await prisma.category.update({
      where: { id, type },
      data
    })

    if (type === 'POST') {
      WebCacheInvalidation.posts()
    }

    return category
  }

  static async deleteMany(ids: string[], type: CategoryType) {
    const result = await prisma.category.deleteMany({
      where: { id: { in: ids }, type }
    })

    if (type === 'POST') {
      WebCacheInvalidation.posts()
    }

    return result
  }

  static async delete(id: string, type: CategoryType) {
    const result = await prisma.category.delete({
      where: { id, type }
    })

    if (type === 'POST') {
      WebCacheInvalidation.posts()
    }

    return result
  }
}
