import type { ButtonProps } from '@nuxt/ui'
import type { RouteLocationRaw } from 'vue-router'

export interface PanelHeaderAction {
  label: string
  icon: string
  to?: RouteLocationRaw
  color?: ButtonProps['color']
  variant?: ButtonProps['variant']
  onSelect?: () => void
}
