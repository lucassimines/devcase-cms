import { prismaRaw } from '@src/db.js'
import { CategoryType } from '@src/generated/prisma/client.js'

type LocalizedName = Record<string, string>

export async function seedPostCategory(slug: string, name: LocalizedName, order = 0) {
  return prismaRaw.category.create({
    data: {
      slug,
      name,
      type: CategoryType.POST,
      order
    }
  })
}

export async function seedPublishedPost(
  slug: string,
  options: {
    order?: number
    categoryIds?: string[]
    published?: boolean
  } = {}
) {
  const { order = 0, categoryIds = [], published = true } = options

  return prismaRaw.post.create({
    data: {
      slug,
      name: { 'en-US': slug, 'pt-BR': slug },
      published,
      order,
      categories: categoryIds.length
        ? {
            connect: categoryIds.map((id) => ({ id }))
          }
        : undefined
    }
  })
}

export async function clearPostsAndCategories() {
  await prismaRaw.post.deleteMany()
  await prismaRaw.category.deleteMany()
}
