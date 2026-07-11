import { prisma } from '@src/db.js'
import type { PostCreateInput } from '@src/generated/prisma/models.js'
import { createAtTopOrder } from '@src/utils/order.utils.js'
import { withUniqueSlug } from '@src/utils/slug.utils.js'
import { toSlug } from '@src/utils/string.utils.js'
import type { GeneratedPostContent } from './post-generate.types.js'

export function resolvePostSlug(content: GeneratedPostContent, slug?: string) {
  const base = slug?.trim() || toSlug(content.name['en-US'])

  if (!base) {
    throw new Error('Could not derive a slug from the English title.')
  }

  return base
}

export async function saveGeneratedPost(
  content: GeneratedPostContent,
  options: Pick<PostCreateInput, 'slug' | 'published'>
) {
  const slug = resolvePostSlug(content, options.slug)
  const unique = await withUniqueSlug(prisma.post, { slug })

  const post = await createAtTopOrder('post', {
    name: content.name,
    excerpt: content.excerpt,
    content: content.content,
    slug: unique.slug,
    published: options.published ?? false
  })

  return post
}
