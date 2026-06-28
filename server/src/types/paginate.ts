export type PaginatedArgs = {
  page: number
  limit: number
  where?: Record<string, any>
  include?: Record<string, any>
  orderBy?: Record<string, any>
}

export type PaginateInput = {
  where?: any
  orderBy?: any
  skip?: number
  take?: number
  include?: any
  page?: string | number
  limit?: string | number
  term?: string
  filterBy?: string | string[]
}
