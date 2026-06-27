import { prisma } from '@src/db.js'
import type { PostCreateInput, PostUpdateInput } from '@src/generated/prisma/models.js'
import { createAtTopOrder } from '@src/utils/order.utils.js'

export class PostRepository {
  static findById(id: string) {
    return prisma.post.findFirst({
      where: { id }
    })
  }

  static create(data: PostCreateInput) {
    return createAtTopOrder('post', data)
  }

  static update(id: string, data: PostUpdateInput) {
    return prisma.post.update({
      where: { id },
      data
    })
  }

  static deleteMany(ids: string[]) {
    return prisma.post.deleteMany({
      where: { id: { in: ids } }
    })
  }

  static delete(id: string) {
    return prisma.post.delete({
      where: { id }
    })
  }
}
