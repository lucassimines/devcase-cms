const DEFAULT_LOCALE = 'en-US'
const SECONDARY_LOCALE = 'pt-BR'

export type LocalizedJson = Record<string, string>

export function emptyLocalizedString(): LocalizedJson {
  return { [DEFAULT_LOCALE]: '', [SECONDARY_LOCALE]: '' }
}

export function isLocalizedString(value: unknown): value is LocalizedJson {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const record = value as Record<string, unknown>

  return DEFAULT_LOCALE in record || SECONDARY_LOCALE in record
}

function parseJsonObject(value: string): LocalizedJson | null {
  const trimmed = value.trim()

  if (!trimmed.startsWith('{')) return null

  try {
    const parsed: unknown = JSON.parse(trimmed)

    if (isLocalizedString(parsed)) return parsed
  } catch {
    return null
  }

  return null
}

/** Wraps a plain string (or stringified JSON) as a localized object. */
export function toLocalizedString(value: unknown): LocalizedJson {
  if (!value) return emptyLocalizedString()

  if (typeof value === 'string') {
    return parseJsonObject(value) ?? { [DEFAULT_LOCALE]: value, [SECONDARY_LOCALE]: '' }
  }

  if (isLocalizedString(value)) {
    return {
      [DEFAULT_LOCALE]: value[DEFAULT_LOCALE] ?? '',
      [SECONDARY_LOCALE]: value[SECONDARY_LOCALE] ?? ''
    }
  }

  return emptyLocalizedString()
}

type BlockRecord = {
  type?: string
  content?: Record<string, unknown>
}

export function migrateProjectBlock(block: unknown): unknown {
  if (!block || typeof block !== 'object' || Array.isArray(block)) return block

  const typedBlock = block as BlockRecord

  if (!typedBlock.type || !typedBlock.content) return block

  switch (typedBlock.type) {
    case 'text':
      return {
        ...typedBlock,
        content: {
          text: toLocalizedString(typedBlock.content.text)
        }
      }

    case 'image':
      return {
        ...typedBlock,
        content: {
          image: toLocalizedString(typedBlock.content.image)
        }
      }

    case 'web': {
      const image = typedBlock.content.image

      if (typeof image !== 'object' || image === null || Array.isArray(image)) {
        return block
      }

      const { desktop, mobile } = image as Record<string, unknown>

      return {
        ...typedBlock,
        content: {
          image: {
            desktop: toLocalizedString(desktop),
            mobile: toLocalizedString(mobile)
          }
        }
      }
    }

    case 'text_image':
      return {
        ...typedBlock,
        content: {
          image: toLocalizedString(typedBlock.content.image),
          title: toLocalizedString(typedBlock.content.title),
          text: toLocalizedString(typedBlock.content.text),
          textPosition: typedBlock.content.textPosition ?? 'left'
        }
      }

    default:
      return block
  }
}

export function migrateProjectBlocks(blocks: unknown): unknown[] {
  if (!Array.isArray(blocks)) return []

  return blocks.map(migrateProjectBlock)
}

export function projectBlocksNeedMigration(blocks: unknown): boolean {
  if (!Array.isArray(blocks)) return false

  return JSON.stringify(blocks) !== JSON.stringify(migrateProjectBlocks(blocks))
}
