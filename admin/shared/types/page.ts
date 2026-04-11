import type { NavigationMenuItem } from '@nuxt/ui'

export interface PageMeta extends NavigationMenuItem {
  model: string
  edit: {
    route: string
    label: string
  }
  create: {
    label: string
  }
}
