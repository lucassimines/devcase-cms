import type { LocalizedString } from '~/types/locale'

export default defineNuxtPlugin(() => {
  const { locale } = useLocale()

  return {
    provide: {
      tr: (text: string | LocalizedString | undefined | null): string => {
        return resolveLocalizedText(text, locale.value)
      }
    }
  }
})
