import type { PaginatedArgs } from '@src/types/paginate.js'
import type { PrismaDelegate, PrismaFindManyArgs } from '@src/types/prisma.js'

import { z } from 'zod'

const jsonStringOrObject = z.union([z.string(), z.record(z.string(), z.any())])

const stringArrayQuery = z.preprocess((val) => {
  if (val === undefined || val === null || val === '') return []
  return Array.isArray(val) ? val : [val]
}, z.array(z.string()))

const PaginatedQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  term: z.string().optional(),
  filterBy: stringArrayQuery.default([]),
  include: jsonStringOrObject.optional(),
  orderBy: jsonStringOrObject.optional(),
  where: jsonStringOrObject.optional()
})

/**
 * Handle query parameters
 */
function handleQueryParameters(query: object | string = {}): object {
  if (typeof query === 'string') {
    try {
      query = JSON.parse(query)
    } catch (error) {
      throw new Error('Invalid query format. Please provide a valid JSON string.')
    }
  }

  // Ensure the result is an object
  if (typeof query !== 'object' || query === null) {
    throw new Error('Query must be an object.')
  }

  return query
}

/**
 * Handle pagination number errors
 */
function handlePageErrors(page: number, limit: number) {
  if (isNaN(page) || page < 1) {
    throw new Error('Page must be a positive number.')
  }
  if (isNaN(limit) || limit < 1) {
    throw new Error('Limit must be a positive number.')
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
function makeFilterQuery(term: string, filterKeys: string[]) {
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

function mergeWhereQuery(baseWhere: object, termWhere: object) {
  if (!hasWhereConditions(termWhere)) return baseWhere
  if (!hasWhereConditions(baseWhere)) return termWhere

  return { AND: [baseWhere, termWhere] }
}

async function findPaginated<T>(model: PrismaDelegate, args: PaginatedArgs) {
  const { page, limit, where, include, orderBy } = args

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      include,
      orderBy: [orderBy, { id: 'asc' }],
      skip: (page - 1) * limit,
      take: limit
    }) as Promise<T[]>,
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
 * Fetch paginated list items
 */
export async function paginate<T = unknown>(model: PrismaDelegate, query: PrismaFindManyArgs) {
  const normalizedQuery = PaginatedQuerySchema.parse(query)

  const {
    page = '1',
    limit = '10',
    term,
    filterBy,
    include,
    orderBy = { createdAt: 'desc' },
    where
  } = normalizedQuery

  // Ensure page and limit are valid numbers
  const pageNumber = Number(page)
  const limitNumber = Number(limit)

  let whereQuery = handleQueryParameters(where)

  if (term && filterBy.length > 0) {
    whereQuery = mergeWhereQuery(whereQuery, makeFilterQuery(term.toString(), filterBy))
  }

  // Check if page and limit are valid numbers
  handlePageErrors(pageNumber, limitNumber)

  return await findPaginated<T>(model, {
    page: pageNumber,
    limit: limitNumber,
    where: whereQuery,
    include: handleQueryParameters(include),
    orderBy: handleQueryParameters(orderBy)
  })
}
