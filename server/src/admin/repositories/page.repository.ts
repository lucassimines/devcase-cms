import { prisma } from '@src/db.js'
import type { PageCreateInput, PageUpdateInput } from '@src/generated/prisma/models.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'
import { resolveLocalizedText } from '@src/utils/locale.utils.js'
import { createAtTopOrder } from '@src/utils/order.utils.js'
import { toSlug } from '@src/utils/string.utils.js'

export class PageRepository {
  static findById(id: string) {
    return prisma.page.findFirst({
      where: { id }
    })
  }

  static async create(data: PageCreateInput) {
    const page = await createAtTopOrder('page', {
      ...data,
      code: toSlug(resolveLocalizedText(data.name))
    })

    WebCacheInvalidation.pages()

    return page
  }

  static async update(id: string, data: PageUpdateInput) {
    const page = await prisma.page.update({
      where: { id },
      data
    })

    WebCacheInvalidation.pages()

    return page
  }

  static async deleteMany(ids: string[]) {
    const result = await prisma.page.deleteMany({
      where: { id: { in: ids } }
    })

    WebCacheInvalidation.pages()

    return result
  }

  static async delete(id: string) {
    const result = await prisma.page.delete({
      where: { id }
    })

    WebCacheInvalidation.pages()

    return result
  }
}
