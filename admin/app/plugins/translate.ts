import { DEFAULT_LOCALE } from '~/types/locale'

export default defineNuxtPlugin(() => {
  // @TODO: get locale from config
  const locale = DEFAULT_LOCALE

  return {
    provide: {
      tr: (text: string | LocalizedString | undefined | null): string => {
        if (!text) return ''

        if (typeof text === 'string') return text

        if (locale) {
          return text[locale] || text[DEFAULT_LOCALE]
        }

        return ''
      }
    }
  }
})
