import { HttpError } from '@src/errors/http.error.js'
import type { PostGenerateInput } from '@src/admin/schemas/post-generate.schema.js'
import { generatePostWithCursorApi } from './providers/cursor-agent.provider.js'
import { saveGeneratedPost } from './post-generate.store.js'

export class PostGenerateService {
  static async generateAndSave({ topic }: PostGenerateInput) {
    try {
      const content = await generatePostWithCursorApi({ topic })

      return saveGeneratedPost(content, {
        published: false
      })
    } catch (err) {
      if (err instanceof HttpError) {
        throw err
      }

      const message = err instanceof Error ? err.message : 'Post generation failed.'

      throw new HttpError(502, message)
    }
  }
}
