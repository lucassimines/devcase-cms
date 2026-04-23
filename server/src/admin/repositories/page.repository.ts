import { prisma } from '@src/db.js'
import type { PageCreateInput, PageUpdateInput } from '@src/generated/prisma/models.js'
import { toSlug } from '@src/utils/string.utils.js'

export class PageRepository {
  static findById(id: string) {
    return prisma.page.findFirst({
      where: { id }
    })
  }

  static create(data: PageCreateInput) {
    return prisma.page.create({
      data: {
        ...data,
        code: data.code?.toLowerCase() || toSlug(data.name)
      }
    })
  }

  static update(id: string, data: PageUpdateInput) {
    return prisma.page.update({
      where: { id },
      data
    })
  }

  static deleteMany(ids: string[]) {
    return prisma.page.deleteMany({
      where: { id: { in: ids } }
    })
  }

  static delete(id: string) {
    return prisma.page.delete({
      where: { id }
    })
  }
}
