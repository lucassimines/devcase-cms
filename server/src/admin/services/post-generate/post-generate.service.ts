import type { PostGenerateInput } from '@src/admin/schemas/post-generate.schema.js'
import { throwGenerationHttpError } from './post-generate.error.js'
import { saveGeneratedPost } from './post-generate.store.js'
import { generatePostWithCursorApi } from './providers/cursor-agent.provider.js'

export class PostGenerateService {
  static async generateAndSave({ topic }: PostGenerateInput) {
    try {
      const content = await generatePostWithCursorApi({ topic })

      return saveGeneratedPost(content, {
        slug: '',
        published: false
      })
    } catch (err) {
      throwGenerationHttpError(err, 'Post generation failed.')
    }
  }
}
