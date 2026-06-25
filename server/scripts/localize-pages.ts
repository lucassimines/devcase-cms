import 'dotenv/config'

import type { Prisma } from '../src/generated/prisma/client.js'
import { prismaRaw } from '../src/db.js'

const DEFAULT_LOCALE = 'en-US'
const LOCALE_KEY = /^[a-z]{2}(-[A-Z]{2})?$/

const SKIP_KEYS = new Set([
  'type',
  'code',
  'slug',
  'id',
  'textPosition',
  'url',
  'href',
  'filename'
])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLocalizedString(value: unknown): value is Record<string, string> {
  if (!isPlainObject(value)) return false

  const entries = Object.entries(value)
  if (entries.length === 0) return false

  return entries.every(([key, val]) => LOCALE_KEY.test(key) && typeof val === 'string')
}

function localizeJson(value: unknown): unknown {
  if (value === null || value === undefined) return value

  if (typeof value === 'string') {
    return { [DEFAULT_LOCALE]: value }
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => localizeJson(item))
  }

  if (isPlainObject(value)) {
    if (isLocalizedString(value)) return value

    const result: Record<string, unknown> = {}

    for (const [key, val] of Object.entries(value)) {
      result[key] = SKIP_KEYS.has(key) ? val : localizeJson(val)
    }

    return result
  }

  return value
}

function localizeName(name: Prisma.JsonValue | null): Prisma.InputJsonValue | undefined {
  if (name === null || name === undefined) return undefined

  if (typeof name === 'string') {
    return { [DEFAULT_LOCALE]: name }
  }

  if (isLocalizedString(name)) return name

  return localizeJson(name) as Prisma.InputJsonValue
}

function localizeField(value: Prisma.JsonValue | null): Prisma.InputJsonValue | null | undefined {
  if (value === null) return null
  if (value === undefined) return undefined

  return localizeJson(value) as Prisma.InputJsonValue
}

function hasChanges(before: unknown, after: unknown): boolean {
  return JSON.stringify(before) !== JSON.stringify(after)
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const pages = await prismaRaw.page.findMany({
    select: {
      id: true,
      code: true,
      name: true,
      blocks: true,
      content: true
    }
  })

  let updated = 0

  for (const page of pages) {
    const nextName = localizeName(page.name)
    const nextBlocks = page.blocks === null ? null : localizeField(page.blocks)
    const nextContent = page.content === null ? null : localizeField(page.content)

    const data: Prisma.PageUpdateInput = {}
    let changed = false

    if (nextName !== undefined && hasChanges(page.name, nextName)) {
      data.name = nextName
      changed = true
    }

    if (nextBlocks !== undefined && hasChanges(page.blocks, nextBlocks)) {
      data.blocks = nextBlocks
      changed = true
    }

    if (nextContent !== undefined && hasChanges(page.content, nextContent)) {
      data.content = nextContent
      changed = true
    }

    if (!changed) {
      console.log(`skip  ${page.code} (already localized)`)
      continue
    }

    console.log(`${dryRun ? 'dry-run' : 'update'} ${page.code}`)

    if (!dryRun) {
      await prismaRaw.page.update({
        where: { id: page.id },
        data
      })
    }

    updated++
  }

  console.log(
    dryRun
      ? `Dry run complete. ${updated} page(s) would be updated.`
      : `Done. ${updated} page(s) updated.`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prismaRaw.$disconnect()
  })
