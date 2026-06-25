import * as z from 'zod'

import { localeCodes, type LocaleCode } from '~/types/locale'

export type LocalizedString = Record<LocaleCode, string>

export function emptyLocalizedString(): LocalizedString {
  return Object.fromEntries(localeCodes.map((code) => [code, ''])) as LocalizedString
}

export function localizedStringSchema() {
  const shape = Object.fromEntries(localeCodes.map((code) => [code, z.string()])) as Record<
    LocaleCode,
    z.ZodString
  >

  return z.object(shape).default(emptyLocalizedString())
}
