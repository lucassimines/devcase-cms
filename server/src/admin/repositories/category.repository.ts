import { prisma } from '@src/db.js'
import type {
  CategoryCreateInput,
  CategoryInclude,
  CategoryUpdateInput
} from '@src/generated/prisma/models.js'

export class CategoryRepository {
  static async findById(id: string) {
    return prisma.category.findUnique({
      where: { id }
    })
  }

  static async allParents(include?: CategoryInclude) {
    return await prisma.category.findMany({
      where: {
        parentId: null
      },
      include
    })
  }

  static async create(data: CategoryCreateInput) {
    return prisma.category.create({ data })
  }

  static async update(id: string, data: CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data
    })
  }

  static async delete(id: string) {
    return await prisma.category.delete({
      where: { id }
    })
  }
}
