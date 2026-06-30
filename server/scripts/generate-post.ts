#!/usr/bin/env tsx
import 'dotenv/config'

import { parseArgs } from 'node:util'

import { prisma } from '../src/db.js'
import { generatePost, resolveProvider } from '../src/lib/post-generator/post-generator.js'
import { loadPostFromFile } from '../src/lib/post-generator/post-generator.load.js'
import { promptPostOptions } from '../src/lib/post-generator/post-generator.prompts.js'
import { saveGeneratedPost } from '../src/lib/post-generator/post-generator.store.js'

function printHelp() {
  console.log(`Usage:
  npm run generate:post
  npm run generate:post -- --topic "Why Nuxt 4 matters for Vue teams"
  npm run generate:post -- --topic "..." --provider openai
  npm run generate:post -- --topic "..." --provider cursor
  npm run generate:post -- --from scripts/posts/example.post.json
  npm run generate:post -- --topic "..." --publish --category development
  npm run generate:post -- --topic "..." --dry-run

  make generate-post

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

Environment (Cursor — default):
  CURSOR_API_KEY               API key from Cursor Dashboard → Integrations
  POST_GENERATOR_CURSOR_MODEL  Optional Cursor model
  POST_GENERATOR_CURSOR_OUTPUT_FORMAT  text (default), json, or stream-json
  POST_GENERATOR_WORKSPACE     Optional workspace path
  Or run once: cursor agent login

Environment (OpenAI — optional, --provider openai only):
  OPENAI_API_KEY
  POST_GENERATOR_MODEL      Optional (default: gpt-4o-mini)
  POST_GENERATOR_API_URL    Optional OpenAI-compatible endpoint
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

  let topic = values.topic?.trim()
  let from = values.from?.trim()
  let provider = resolveProvider(values.provider)
  let slug = values.slug?.trim()
  let category = values.category
  let keywords = values.keywords
  let tone = values.tone?.trim()
  let publish = values.publish
  let dryRun = values['dry-run']

  const hasTopic = Boolean(topic)
  const hasFile = Boolean(from)

  if (!hasTopic && !hasFile) {
    const prompted = await promptPostOptions()

    topic = prompted.topic
    from = prompted.from
    provider = resolveProvider(prompted.provider)
    slug = prompted.slug
    category = prompted.category
    keywords = prompted.keywords
    tone = prompted.tone
    publish = prompted.publish
    dryRun = prompted.dryRun
  } else if (hasTopic && hasFile) {
    throw new Error('Provide exactly one of --topic or --from.')
  }

  const generateOptions = {
    topic: topic!,
    keywords: keywords
      ?.split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    tone
  }

  const content = from
    ? await loadPostFromFile(from)
    : await generatePost(generateOptions, provider)

  if (dryRun) {
    console.log(JSON.stringify(content, null, 2))
    return
  }

  const saved = await saveGeneratedPost(content, {
    slug,
    published: publish,
    categorySlugs: category
  })

  console.log('\nPost created successfully.')
  console.log(`  id:        ${saved.id}`)
  console.log(`  slug:      ${saved.slug}`)
  console.log(`  published: ${saved.published}`)
  if (!from) {
    console.log(`  provider:  ${provider}`)
  }

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
