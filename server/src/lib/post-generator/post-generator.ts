import type { GeneratePostOptions, GeneratedPostContent } from './post-generator.types.js'
import { generatePostWithOpenAi } from './post-generator.ai.js'
import { generatePostWithCursorApi } from './post-generator.api.js'
import { generatePostWithCursorCli, hasCursorCli } from './post-generator.cursor.js'

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

async function generatePostWithCursor(options: GeneratePostOptions) {
  if (process.env.POST_GENERATOR_USE_CLI === 'true') {
    return generatePostWithCursorCli(options)
  }

  if (process.env.POST_GENERATOR_USE_API === 'true' || !(await hasCursorCli())) {
    return generatePostWithCursorApi(options)
  }

  return generatePostWithCursorCli(options)
}

export async function generatePost(
  options: GeneratePostOptions,
  provider: PostGeneratorProvider = 'cursor'
): Promise<GeneratedPostContent> {
  if (provider === 'openai') {
    return generatePostWithOpenAi(options)
  }

  return generatePostWithCursor(options)
}
