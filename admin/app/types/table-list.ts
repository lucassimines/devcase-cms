import type { RouteLocationRaw } from 'vue-router'

export type TableListItem<T> = T & { id: string }

export type Path<T, Depth extends number = 3> = [Depth] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & (string | number)]: `${K}` | `${K}.${Path<T[K], PrevDepth<Depth>>}`
      }[keyof T & (string | number)]
    : never

type PrevDepth<N extends number> = [never, 0, 1, 2, 3][N]

export interface PaginatedTableList<T> {
  data: TableListItem<T>[]
  meta: {
    total: number
    page: number
    limit: number
    last_page: number
  }
}

export interface ListActionButton {
  type: 'edit' | 'delete'
  to?: RouteLocationRaw
  icon?: string
}
