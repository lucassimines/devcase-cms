import { generatePost } from '@src/lib/post-generator/post-generator.js'
import { saveGeneratedPost } from '@src/lib/post-generator/post-generator.store.js'
import type { PostGenerateInput } from '@src/admin/schemas/post-generate.schema.js'

export class PostGenerateService {
  static async generateAndSave({ topic }: PostGenerateInput) {
    const content = await generatePost({ topic }, 'cursor')

    return saveGeneratedPost(content, {
      published: false
    })
  }
}
