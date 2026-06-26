const DEFAULT_LOCALE = 'en-US'

export function resolveLocalizedText(value: unknown, locale = DEFAULT_LOCALE): string {
  if (!value) return ''

  if (typeof value === 'string') return value

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, string>

    return record[locale] || record[DEFAULT_LOCALE] || ''
  }

  return ''
}
