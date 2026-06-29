#!/usr/bin/env tsx
import 'dotenv/config'

import { parseArgs } from 'node:util'

import { prisma } from '../src/db.js'
import { generatePost, resolveProvider } from './lib/post-generator.js'
import { loadPostFromFile } from './lib/post-generator.load.js'
import { saveGeneratedPost } from './lib/post-generator.store.js'

function printHelp() {
  console.log(`Usage:
  npm run generate:post -- --topic "Why Nuxt 4 matters for Vue teams"
  npm run generate:post -- --topic "..." --provider openai
  npm run generate:post -- --topic "..." --provider cursor
  npm run generate:post -- --from scripts/posts/example.post.json
  npm run generate:post -- --topic "..." --publish --category development
  npm run generate:post -- --topic "..." --dry-run

Options:
  --topic, -t         Topic or brief for AI generation
  --from, -f          Path to a JSON file with bilingual post content
  --provider          openai (default) or cursor
  --slug, -s          Override slug (defaults to English title slug)
  --category, -c      POST category slug (repeatable)
  --keywords, -k      Extra keywords for AI (comma-separated)
  --tone              Optional tone hint for AI
  --publish           Save as published (default: draft)
  --dry-run           Print generated JSON without saving
  --help, -h          Show this help

Environment (OpenAI — default provider):
  OPENAI_API_KEY            Required for --provider openai
  POST_GENERATOR_MODEL      Optional (default: gpt-4o-mini)
  POST_GENERATOR_API_URL    Optional OpenAI-compatible endpoint

Environment (Cursor):
  POST_GENERATOR_CURSOR_MODEL  Optional Cursor model
  POST_GENERATOR_WORKSPACE     Optional workspace path
  Run once: cursor agent login
`)
}

async function main() {
  const { values } = parseArgs({
    options: {
      topic: { type: 'string', short: 't' },
      from: { type: 'string', short: 'f' },
      provider: { type: 'string' },
      slug: { type: 'string', short: 's' },
      category: { type: 'string', multiple: true, short: 'c' },
      keywords: { type: 'string', short: 'k' },
      tone: { type: 'string' },
      publish: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false }
    },
    allowPositionals: false
  })

  if (values.help) {
    printHelp()
    return
  }

  const hasTopic = Boolean(values.topic?.trim())
  const hasFile = Boolean(values.from?.trim())

  if (hasTopic === hasFile) {
    throw new Error('Provide exactly one of --topic or --from.')
  }

  const generateOptions = {
    topic: values.topic!.trim(),
    keywords: values.keywords
      ?.split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    tone: values.tone?.trim()
  }

  const provider = resolveProvider(values.provider)

  const content = hasFile
    ? await loadPostFromFile(values.from!)
    : await generatePost(generateOptions, provider)

  if (values['dry-run']) {
    console.log(JSON.stringify(content, null, 2))
    return
  }

  const saved = await saveGeneratedPost(content, {
    slug: values.slug?.trim(),
    published: values.publish,
    categorySlugs: values.category
  })

  console.log('\nPost created successfully.')
  console.log(`  id:        ${saved.id}`)
  console.log(`  slug:      ${saved.slug}`)
  console.log(`  published: ${saved.published}`)
  console.log(`  provider:  ${provider}`)

  if (saved.categorySlugs.length) {
    console.log(`  categories: ${saved.categorySlugs.join(', ')}`)
  }

  console.log('\nEdit in admin: /post/' + saved.id)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
