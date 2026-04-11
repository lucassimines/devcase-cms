import type { NavigationMenuItem } from '@nuxt/ui'

export function useNavigation() {
  const { t } = useI18n()

  const navigation: { main: NavigationMenuItem[] } = {
    main: [
      {
        label: t('nav.home'),
        icon: 'lucide:home',
        to: '/'
      },
      {
        label: t('nav.projects'),
        icon: 'lucide:terminal',
        to: { name: 'project' }
      }
    ]
  }

  return {
    navigation
  }
}
