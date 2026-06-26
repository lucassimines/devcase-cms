import * as z from 'zod'

import { DEFAULT_LOCALE, localeCodes, type LocaleCode, type LocalizedString } from '~/types/locale'

export function emptyLocalizedString(): LocalizedString {
  return Object.fromEntries(localeCodes.map((code) => [code, ''])) as LocalizedString
}

export function localizedStringSchema() {
  const shape = Object.fromEntries(
    localeCodes.map((code) => [code, code === DEFAULT_LOCALE ? z.string().min(1) : z.string()])
  ) as Record<LocaleCode, z.ZodString>

  return z.object(shape).default(emptyLocalizedString())
}

export function makeLocalizedPath(field: string, locale: LocaleCode) {
  return `${field}.${locale}`
}
