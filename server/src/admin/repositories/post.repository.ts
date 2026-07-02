import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import type { PostCreateInput, PostUpdateInput } from '@src/generated/prisma/models.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'
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

  static async create(data: PostCreateInput) {
    const post = await createAtTopOrder('post', data)

    WebCacheInvalidation.posts()

    return post
  }

  static async update(id: string, data: PostUpdateInput & { categories?: string[] }) {
    const { categories, ...rest } = data

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...rest,
        categories: {
          set: categories?.map((id) => ({ id })) ?? []
        }
      },
      include: { categories: true }
    })

    WebCacheInvalidation.posts()

    return normalizePostToForm(post)
  }

  static async deleteMany(ids: string[]) {
    const result = await prisma.post.deleteMany({
      where: { id: { in: ids } }
    })

    WebCacheInvalidation.posts()

    return result
  }

  static async delete(id: string) {
    const result = await prisma.post.delete({
      where: { id }
    })

    WebCacheInvalidation.posts()

    return result
  }
}
