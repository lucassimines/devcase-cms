import { prisma } from '@src/db.js'
import { CategoryType } from '@src/generated/prisma/client.js'

const categorySelect = {
  id: true,
  name: true,
  slug: true
} as const

export class PostCategoryService {
  static all() {
    return prisma.category.findMany({
      where: { type: CategoryType.POST },
      orderBy: { order: 'asc' },
      select: categorySelect
    })
  }
}
