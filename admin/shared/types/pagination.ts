export interface PaginationQuery {
  page: number
  limit: number
  term?: string
  orderBy?: Record<string, 'asc' | 'desc'>
  filterBy?: string | string[]
}
