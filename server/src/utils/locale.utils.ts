import {
  emptyLocalizedString,
  isLocalizedString,
  toLocalizedString,
  type LocalizedJson
} from '@src/utils/localized-json.utils.js'

const DEFAULT_LOCALE = 'en-US'

export type { LocalizedJson }

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

export function resolveLocalizedText(value: unknown, locale = DEFAULT_LOCALE): string {
  if (!value) return ''

  if (typeof value === 'string') {
    const parsed = parseJsonObject(value)

    if (parsed) return resolveLocalizedText(parsed, locale)

    return value
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, string>

    return record[locale] || record[DEFAULT_LOCALE] || ''
  }

  return ''
}

export { emptyLocalizedString, isLocalizedString, toLocalizedString }
