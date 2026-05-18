import type { NavigationMenuItem } from '@nuxt/ui'

export function useNavigation() {
  const { $entities } = useNuxtApp()
  const { t } = useI18n()

  const navigation: { main: NavigationMenuItem[] } = {
    main: [
      {
        label: t('nav.home'),
        icon: 'lucide:home',
        to: '/'
      },
      ...Object.values($entities).map((entity) => ({
        label: entity.label,
        icon: entity.icon,
        to: entity.path
      }))
    ]
  }

  return {
    navigation
  }
}
