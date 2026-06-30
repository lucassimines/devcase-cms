import { prisma } from '@src/db.js'
import { createAtTopOrder } from '@src/utils/order.utils.js'
import { toSlug } from '@src/utils/string.utils.js'
import { withUniqueSlug } from '@src/utils/slug.utils.js'
import type { GeneratedPostContent, SavePostOptions, SavedPostResult } from './post-generator.types.js'

export function resolvePostSlug(content: GeneratedPostContent, slug?: string) {
  const base = slug?.trim() || toSlug(content.name['en-US'])

  if (!base) {
    throw new Error('Could not derive a slug from the English title.')
  }

  return base
}

export async function findCategoryIds(slugs: string[] = []) {
  if (!slugs.length) return []

  const categories = await prisma.category.findMany({
    where: {
      type: 'POST',
      slug: { in: slugs }
    },
    select: { id: true, slug: true }
  })

  const foundSlugs = new Set(categories.map((category) => category.slug))
  const missing = slugs.filter((slug) => !foundSlugs.has(slug))

  if (missing.length) {
    throw new Error(`Category slug(s) not found: ${missing.join(', ')}`)
  }

  return categories.map((category) => category.id)
}

export async function saveGeneratedPost(
  content: GeneratedPostContent,
  options: SavePostOptions = {}
): Promise<SavedPostResult> {
  const slug = resolvePostSlug(content, options.slug)
  const unique = await withUniqueSlug(prisma.post, { slug })
  const categoryIds = await findCategoryIds(options.categorySlugs)

  const post = (await createAtTopOrder('post', {
    name: content.name,
    excerpt: content.excerpt,
    content: content.content,
    slug: unique.slug as string,
    published: options.published ?? false,
    categories: categoryIds.length
      ? {
          connect: categoryIds.map((id) => ({ id }))
        }
      : undefined
  })) as unknown as { id: string; slug: string; published: boolean }

  return {
    id: post.id,
    slug: post.slug,
    published: post.published,
    categorySlugs: options.categorySlugs ?? []
  }
}
