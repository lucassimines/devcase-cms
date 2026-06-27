import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import type { PostCreateInput, PostUpdateInput } from '@src/generated/prisma/models.js'
import { createAtTopOrder } from '@src/utils/order.utils.js'

type PostWithIncludes = Prisma.PostGetPayload<{
  include: { categories: true }
}>

function normalizePostToForm(post: PostWithIncludes) {
  return {
    ...post,
    categories: post.categories.map((category) => category.id)
  }
}

export class PostRepository {
  static async findById(id: string) {
    const post = await prisma.post.findFirst({
      where: { id },
      include: { categories: true }
    })

    if (!post) return null

    return normalizePostToForm(post)
  }

  static create(data: PostCreateInput) {
    return createAtTopOrder('post', data)
  }

  static async update(
    id: string,
    data: PostUpdateInput & { categories?: string[] }
  ) {
    const { categories, ...rest } = data

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...rest,
        ...(categories !== undefined && {
          categories: {
            set: categories.map((categoryId) => ({ id: categoryId }))
          }
        })
      },
      include: { categories: true }
    })

    return normalizePostToForm(post)
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
