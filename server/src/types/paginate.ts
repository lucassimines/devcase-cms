export type PaginateQuery = {
  page?: string | number
  limit?: string | number
  term?: string
  filterBy?: string | string[]
  orderBy?: Record<string, unknown> | string
}

export type PaginateOptions = {
  where?: Record<string, unknown>
  select?: Record<string, unknown>
  include?: Record<string, unknown>
}

export type PaginatedArgs = PaginateOptions & {
  page: number
  limit: number
  orderBy?: Record<string, unknown>
}

export type PaginatedResult<T> = {
  data: T[]
  meta: {
    page: number
    total: number
    limit: number
    last_page: number
  }
}
