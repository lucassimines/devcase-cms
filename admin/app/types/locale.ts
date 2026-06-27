export const localeCodes = ['en-US', 'pt-BR'] as const

export type LocaleCode = (typeof localeCodes)[number]

export type LocalizedString = Record<LocaleCode, string>

export const DEFAULT_LOCALE: LocaleCode = localeCodes[0]

export interface Locale {
  code: LocaleCode
  name: string
  abbr: string
}
