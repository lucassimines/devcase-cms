import type { NavigationMenuItem } from '@nuxt/ui'
import type { Entity } from '~/types/entity'

function toNavItem(entity: Entity): NavigationMenuItem {
  return {
    label: entity.label,
    icon: entity.icon,
    to: entity.path,
    children: entity.children?.map((child) => ({
      label: child.label,
      icon: child.icon,
      to: child.path
    }))
  }
}

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
      ...Object.values($entities)
        .filter((entity) => entity.model !== 'category')
        .map((entity) => toNavItem(entity))
    ]
  }

  return {
    navigation
  }
}
