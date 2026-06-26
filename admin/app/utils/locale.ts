import * as z from 'zod'

import { DEFAULT_LOCALE, localeCodes, type LocaleCode, type LocalizedString } from '~/types/locale'

export function emptyLocalizedString(): LocalizedString {
  return Object.fromEntries(localeCodes.map((code) => [code, ''])) as LocalizedString
}

export function localizedStringSchema(schema: z.ZodString = z.string()) {
  const shape = Object.fromEntries(
    localeCodes.map((code) => [code, code === DEFAULT_LOCALE ? schema : z.string()])
  ) as Record<LocaleCode, z.ZodString>

  return z.object(shape).default(emptyLocalizedString())
}

export function makeLocalizedPath(field: string, locale: LocaleCode) {
  return `${field}.${locale}`
}

export function resolveLocalizedText(
  text: string | LocalizedString | undefined | null,
  locale: LocaleCode
): string {
  if (!text) return ''

  if (typeof text === 'string') return text

  return text[locale] || text[DEFAULT_LOCALE]
}
