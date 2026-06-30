import type { GeneratePostOptions, GeneratedPostContent } from './post-generator.types.js'
import { generatePostWithOpenAi } from './post-generator.ai.js'
import { generatePostWithCursorCli } from './post-generator.cursor.js'

export type PostGeneratorProvider = 'openai' | 'cursor'

export function resolveProvider(explicit?: string): PostGeneratorProvider {
  if (explicit === 'openai' || explicit === 'cursor') {
    return explicit
  }

  if (process.env.POST_GENERATOR_PROVIDER === 'openai') {
    return 'openai'
  }

  return 'cursor'
}

export async function generatePost(
  options: GeneratePostOptions,
  provider: PostGeneratorProvider = 'cursor'
): Promise<GeneratedPostContent> {
  if (provider === 'openai') {
    return generatePostWithOpenAi(options)
  }

  return generatePostWithCursorCli(options)
}
