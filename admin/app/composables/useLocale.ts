import { DEFAULT_LOCALE, type LocaleCode } from '~/types/locale'

export function useLocale() {
  const locale = useState<LocaleCode>('locale', () => DEFAULT_LOCALE)

  return {
    locale
  }
}
