import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

import type { PostGeneratorProvider } from './post-generator.js'
import { resolveProvider } from './post-generator.js'

export type PromptedPostOptions = {
  topic?: string
  from?: string
  provider?: PostGeneratorProvider
  slug?: string
  category?: string[]
  keywords?: string
  tone?: string
  publish: boolean
  dryRun: boolean
}

async function ask(rl: readline.Interface, question: string, defaultValue = '') {
  const suffix = defaultValue ? ` [${defaultValue}]` : ''
  const answer = (await rl.question(`${question}${suffix}: `)).trim()
  return answer || defaultValue
}

async function askYesNo(
  rl: readline.Interface,
  question: string,
  defaultValue = false
) {
  const suffix = defaultValue ? 'Y/n' : 'y/N'
  const answer = (await rl.question(`${question} (${suffix}): `)).trim().toLowerCase()

  if (!answer) return defaultValue

  return answer === 'y' || answer === 'yes'
}

export async function promptPostOptions(): Promise<PromptedPostOptions> {
  const rl = readline.createInterface({ input, output })
  const defaultProvider = resolveProvider()

  try {
    console.log('\nGenerate a bilingual blog post\n')
    console.log('  generate — create content with AI from a topic')
    console.log('  file     — import an existing JSON file\n')

    const source = await ask(rl, 'Source (generate/file)', 'generate')

    let topic: string | undefined
    let from: string | undefined

    if (source.toLowerCase() === 'file') {
      from = await ask(rl, 'JSON file path', 'scripts/posts/example.post.json')

      if (!from) {
        throw new Error('A JSON file path is required.')
      }
    } else if (source.toLowerCase() === 'generate' || source.toLowerCase() === 'ai') {
      topic = await ask(rl, 'Topic or brief')

      if (!topic) {
        throw new Error('A topic is required.')
      }
    } else {
      throw new Error('Source must be "generate" or "file".')
    }

    const providerInput = await ask(
      rl,
      'Provider (cursor/openai/auto)',
      defaultProvider
    )
    const provider =
      providerInput === 'auto' || !providerInput
        ? defaultProvider
        : providerInput === 'cursor' || providerInput === 'openai'
          ? providerInput
          : defaultProvider

    let keywords: string | undefined
    let tone: string | undefined

    if (topic) {
      keywords = (await ask(rl, 'Keywords (comma-separated, optional)')).trim() || undefined
      tone = (await ask(rl, 'Tone (optional)')).trim() || undefined
    }

    const slug = (await ask(rl, 'Slug override (optional)')).trim() || undefined
    const categoriesInput = (await ask(rl, 'Category slugs (comma-separated, optional)')).trim()
    const category = categoriesInput
      ? categoriesInput.split(',').map((slug) => slug.trim()).filter(Boolean)
      : undefined

    const publish = await askYesNo(rl, 'Publish immediately?', false)
    const dryRun = await askYesNo(rl, 'Dry run (print JSON only)?', false)

    return {
      topic,
      from,
      provider,
      slug,
      category,
      keywords,
      tone,
      publish,
      dryRun
    }
  } finally {
    rl.close()
  }
}
