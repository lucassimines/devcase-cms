import { HttpError } from '@src/errors/http.error.js'
import { generatePost } from '@src/lib/post-generator/post-generator.js'
import { saveGeneratedPost } from '@src/lib/post-generator/post-generator.store.js'
import type { PostGenerateInput } from '@src/admin/schemas/post-generate.schema.js'

export class PostGenerateService {
  static async generateAndSave({ topic }: PostGenerateInput) {
    try {
      const content = await generatePost({ topic }, 'cursor')

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
