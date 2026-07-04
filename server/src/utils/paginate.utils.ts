import type {
  PaginatedArgs,
  PaginatedResult,
  PaginateOptions,
  PaginateQuery
} from '@src/types/paginate.js'
import type { PrismaDelegate } from '@src/types/prisma.js'

import { z } from 'zod'

const jsonStringOrObject = z.union([z.string(), z.record(z.string(), z.any())])

const stringArrayQuery = z.preprocess((val) => {
  if (val === undefined || val === null || val === '') return []
  return Array.isArray(val) ? val : [val]
}, z.array(z.string()))

const numericQueryParam = z.union([z.string(), z.number()]).optional()

export const MAX_PAGE_LIMIT = 24

const PaginateQuerySchema = z.object({
  page: numericQueryParam,
  limit: numericQueryParam,
  term: z.string().optional(),
  filterBy: stringArrayQuery.default([]),
  orderBy: jsonStringOrObject.optional()
})

function parseJsonQuery(value: object | string | undefined): Record<string, unknown> | undefined {
  if (value === undefined) return undefined

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid query format. Please provide a valid JSON string.')
      }
      return parsed as Record<string, unknown>
    } catch {
      throw new Error('Invalid query format. Please provide a valid JSON string.')
    }
  }

  return value as Record<string, unknown>
}

/**
 * Handle pagination number errors
 */
function normalizePagination(page: number, limit: number) {
  if (isNaN(page) || page < 1) {
    throw new Error('Page must be a positive number.')
  }
  if (isNaN(limit) || limit < 1) {
    throw new Error('Limit must be a positive number.')
  }

  return {
    page,
    limit: Math.min(limit, MAX_PAGE_LIMIT)
  }
}

function hasWhereConditions(where: object) {
  return Object.keys(where).length > 0
}

function makeJsonPathFilter(field: string, path: string[], term: string) {
  return {
    [field]: {
      path,
      string_contains: term,
      mode: 'insensitive'
    }
  }
}

/**
 * Make filter query based on filter keys and term
 */
function makeFilterQuery(term: string, filterKeys: string[]): Record<string, unknown> {
  const orConditions: Record<string, unknown>[] = []

  filterKeys.forEach((key) => {
    const [field, ...path] = key.split('.')

    if (path.length > 0) {
      orConditions.push(makeJsonPathFilter(field, path, term))
      return
    }

    orConditions.push({
      [key]: { contains: term, mode: 'insensitive' }
    })
  })

  if (orConditions.length === 0) return {}
  if (orConditions.length === 1) return orConditions[0]!

  return { OR: orConditions }
}

function mergeWhereQuery(
  baseWhere: Record<string, unknown>,
  termWhere: Record<string, unknown>
): Record<string, unknown> {
  if (!hasWhereConditions(termWhere)) return baseWhere
  if (!hasWhereConditions(baseWhere)) return termWhere

  return { AND: [baseWhere, termWhere] }
}

async function findPaginated<T>(model: PrismaDelegate, args: PaginatedArgs): Promise<PaginatedResult<T>> {
  const { page, limit, where, include, select, orderBy = { createdAt: 'desc' } } = args

  const findManyArgs: Record<string, unknown> = {
    where,
    orderBy: [orderBy, { id: 'asc' }],
    skip: (page - 1) * limit,
    take: limit
  }

  if (select) {
    findManyArgs.select = select
  } else if (include) {
    findManyArgs.include = include
  }

  const [data, total] = await Promise.all([
    model.findMany(findManyArgs) as Promise<T[]>,
    model.count({ where })
  ])

  return {
    data,
    meta: {
      page,
      total,
      limit,
      last_page: Math.ceil(total / limit)
    }
  }
}

/**
 * Fetch a paginated list.
 *
 * `query` accepts pagination/search/sort params from the request.
 * `options` controls server-side Prisma findMany args (where, select, include).
 */
export async function paginate<T = unknown>(
  model: PrismaDelegate,
  query: PaginateQuery = {},
  options: PaginateOptions = {}
): Promise<PaginatedResult<T>> {
  const { page = '1', limit = '10', term, filterBy, orderBy } = PaginateQuerySchema.parse(query)
  const { where = {}, select, include } = options

  const pageNumber = Number(page)
  const limitNumber = Number(limit)

  let whereQuery = { ...where }

  if (term && filterBy.length > 0) {
    whereQuery = mergeWhereQuery(whereQuery, makeFilterQuery(term.toString(), filterBy))
  }

  const { page: normalizedPage, limit: normalizedLimit } = normalizePagination(
    pageNumber,
    limitNumber
  )

  return findPaginated<T>(model, {
    page: normalizedPage,
    limit: normalizedLimit,
    where: whereQuery,
    orderBy: parseJsonQuery(orderBy),
    select,
    include
  })
}
