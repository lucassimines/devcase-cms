import { DEFAULT_LOCALE, type LocalizedString } from '~/types/locale'

export default defineNuxtPlugin(() => {
  const { locale } = useLocale()

  return {
    provide: {
      tr: (text: string | LocalizedString | undefined | null): string => {
        if (!text) return ''

        if (typeof text === 'string') return text

        return text[locale.value] || text[DEFAULT_LOCALE]
      }
    }
  }
})
