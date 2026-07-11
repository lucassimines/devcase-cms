import { prisma } from '@src/db.js'
import { HttpError } from '@src/errors/http.error.js'
import { isLocalizedString } from '@src/utils/localized-json.utils.js'
import { generateCoverImageWithCursor } from './providers/cursor-agent-image.provider.js'
import { throwGenerationHttpError } from './post-generate.error.js'
import { storeGeneratedCoverImage } from './post-generate-image.store.js'

function localizedText(value: unknown, preferred: 'en-US' | 'pt-BR' = 'en-US') {
  if (!isLocalizedString(value)) return ''

  return value[preferred]?.trim() || value['pt-BR']?.trim() || value['en-US']?.trim() || ''
}

export class PostGenerateImageService {
  static async generateAndSave(postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        slug: true,
        name: true,
        excerpt: true
      }
    })

    if (!post) {
      throw new HttpError(404, 'Post not found.')
    }

    const title = localizedText(post.name)
    const excerpt = localizedText(post.excerpt)

    if (!title) {
      throw new HttpError(400, 'Post must have a title before generating a cover image.')
    }

    try {
      const buffer = await generateCoverImageWithCursor({ title, excerpt })
      const stored = await storeGeneratedCoverImage(buffer, post.slug)

      await prisma.post.update({
        where: { id: post.id },
        data: {
          image: stored.image
        }
      })

      return stored
    } catch (err) {
      throwGenerationHttpError(err, 'Cover image generation failed.')
    }
  }
}
