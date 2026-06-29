import type { GeneratePostOptions, GeneratedPostContent } from './post-generator.types.js'
import { generatePostWithOpenAi } from './post-generator.ai.js'
import { generatePostWithCursor } from './post-generator.cursor.js'

export type PostGeneratorProvider = 'openai' | 'cursor'

export function resolveProvider(explicit?: string): PostGeneratorProvider {
  if (explicit === 'openai' || explicit === 'cursor') {
    return explicit
  }

  if (process.env.POST_GENERATOR_PROVIDER === 'cursor') {
    return 'cursor'
  }

  return 'openai'
}

export async function generatePost(
  options: GeneratePostOptions,
  provider: PostGeneratorProvider = 'openai'
): Promise<GeneratedPostContent> {
  if (provider === 'cursor') {
    return generatePostWithCursor(options)
  }

  return generatePostWithOpenAi(options)
}
