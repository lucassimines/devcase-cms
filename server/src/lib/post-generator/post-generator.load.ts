import { readFile } from 'node:fs/promises'

import { generatedPostSchema } from './post-generator.schema.js'
import type { GeneratedPostContent } from './post-generator.types.js'

export async function loadPostFromFile(filePath: string): Promise<GeneratedPostContent> {
  const raw = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw)

  return generatedPostSchema.parse(parsed)
}
