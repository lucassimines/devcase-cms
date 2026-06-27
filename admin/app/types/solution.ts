import type { LocalizedString } from '~/types/locale'

export interface Solution {
  id: string
  name: LocalizedString
  order: number
}
