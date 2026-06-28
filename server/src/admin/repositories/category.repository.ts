import { prisma } from '@src/db.js'
import type { CategoryType } from '@src/generated/prisma/client.js'
import type { CategoryCreateInput, CategoryUpdateInput } from '@src/generated/prisma/models.js'
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

  static create(data: CategoryCreateInput) {
    return createAtTopOrder('category', data)
  }

  static update(id: string, type: CategoryType, data: CategoryUpdateInput) {
    return prisma.category.update({
      where: { id, type },
      data
    })
  }

  static deleteMany(ids: string[], type: CategoryType) {
    return prisma.category.deleteMany({
      where: { id: { in: ids }, type }
    })
  }

  static delete(id: string, type: CategoryType) {
    return prisma.category.delete({
      where: { id, type }
    })
  }
}
