import { prisma } from '@src/db.js'
import { NotFoundError } from '@src/errors/index.js'
import type { PostSelect } from '@src/generated/prisma/models.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { PostQuery } from '@src/web/queries/post.query.js'
import { PostCategoryService } from '@src/web/services/post-category.service.js'
import type { Request } from 'express'

const POSTS_PER_PAGE = 12

const categorySelect = {
  orderBy: { order: 'asc' as const },
  select: {
    id: true,
    name: true,
    slug: true
  }
}

const listSelect: PostSelect = {
  id: true,
  name: true,
  slug: true,
  image: true,
  excerpt: true,
  createdAt: true,
  categories: categorySelect
}

const categoryInclude = {
  categories: categorySelect
}

export class PostService {
  static async paginatedList(query: Request['query'] = {}) {
    const { category: categorySlug, ...restQuery } = query as {
      category?: string
    }

    if (categorySlug) {
      const category = await PostCategoryService.findBySlug(categorySlug)

      if (!category) {
        throw new NotFoundError('Post category not found')
      }
    }

    const where = {
      ...PostQuery.published(),
      ...(categorySlug
        ? {
            categories: {
              some: { slug: categorySlug }
            }
          }
        : {})
    }

    return paginate(
      prisma.post,
      {
        ...restQuery,
        limit: Number(query.limit ?? POSTS_PER_PAGE),
        orderBy: PostQuery.orderByPosition()
      },
      {
        where,
        select: listSelect
      }
    )
  }

  static async findBySlug(slug: string) {
    return prisma.post.findFirst({
      where: { slug, ...PostQuery.published() },
      include: categoryInclude
    })
  }

  /** Next published post in display order; wraps to the first when last. */
  static async findNextPost(order: number, slug: string) {
    const select: PostSelect = {
      id: true,
      name: true,
      slug: true
    }

    const next = await prisma.post.findFirst({
      where: {
        ...PostQuery.published(),
        OR: [{ order: { gt: order } }, { order: order, slug: { gt: slug } }]
      },
      orderBy: PostQuery.orderByDisplay(),
      select
    })

    if (next) return next

    return prisma.post.findFirst({
      where: PostQuery.published(),
      orderBy: PostQuery.orderByDisplay(),
      select
    })
  }
}
