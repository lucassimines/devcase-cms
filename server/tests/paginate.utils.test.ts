import { describe, expect, it, vi } from 'vitest'

import type { PaginateQuery } from '@src/types/paginate.js'
import type { PrismaDelegate } from '@src/types/prisma.js'
import { MAX_PAGE_LIMIT, paginate } from '@src/utils/paginate.utils.js'

function createMockModel(total: number, data: unknown[] = []): PrismaDelegate {
  return {
    findMany: vi.fn().mockResolvedValue(data),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    count: vi.fn().mockResolvedValue(total)
  }
}

describe('paginate.utils', () => {
  it('uses default page and limit', async () => {
    const model = createMockModel(0)

    const result = await paginate(model, {})

    expect(result.meta).toMatchObject({ page: 1, limit: 10 })
    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 10 })
    )
  })

  it('calculates skip from page number', async () => {
    const model = createMockModel(0)

    await paginate(model, { page: 3, limit: 5 })

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 5 })
    )
  })

  it('returns data and meta with last_page', async () => {
    const rows = [{ id: '1' }, { id: '2' }]
    const model = createMockModel(5, rows)

    const result = await paginate(model, { page: 1, limit: 2 })

    expect(result.data).toEqual(rows)
    expect(result.meta).toEqual({
      page: 1,
      total: 5,
      limit: 2,
      last_page: 3
    })
    expect(model.count).toHaveBeenCalledWith({ where: {} })
  })

  it('respects limits below the cap', async () => {
    const model = createMockModel(0)

    const result = await paginate(model, { limit: 3 })

    expect(result.meta.limit).toBe(3)
    expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 3 }))
  })

  it('clamps limit to MAX_PAGE_LIMIT', async () => {
    const model = createMockModel(0)

    const result = await paginate(model, { limit: 30_000 })

    expect(result.meta.limit).toBe(MAX_PAGE_LIMIT)
    expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: MAX_PAGE_LIMIT }))
  })

  it('rejects non-positive limits', async () => {
    const model = createMockModel(0)

    await expect(paginate(model, { limit: 0 })).rejects.toThrow('Limit must be a positive number.')
  })

  it('rejects non-positive pages', async () => {
    const model = createMockModel(0)

    await expect(paginate(model, { page: 0 })).rejects.toThrow('Page must be a positive number.')
  })

  it('defaults orderBy to createdAt desc', async () => {
    const model = createMockModel(0)

    await paginate(model, { limit: 10 })

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }]
      })
    )
  })

  it('rejects invalid orderBy JSON strings', async () => {
    const model = createMockModel(0)

    await expect(paginate(model, { orderBy: '{invalid' })).rejects.toThrow(
      'Invalid query format. Please provide a valid JSON string.'
    )
  })

  it('ignores include, select, and where passed in query', async () => {
    const model = createMockModel(0)
    const select = { id: true, name: true }
    const unsafeQuery = {
      limit: 10,
      include: { categories: true },
      select,
      where: { published: true },
      orderBy: { slug: 'asc' }
    } as PaginateQuery

    await paginate(model, unsafeQuery)

    expect(model.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({
        include: expect.anything(),
        select: expect.anything()
      })
    )
    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        orderBy: [{ slug: 'asc' }, { id: 'asc' }]
      })
    )
  })

  it('passes orderBy from query as a JSON string', async () => {
    const model = createMockModel(0)

    await paginate(model, {
      limit: 10,
      orderBy: JSON.stringify({ createdAt: 'desc' })
    })

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }]
      })
    )
  })

  it('passes select from options to findMany', async () => {
    const model = createMockModel(0)
    const select = { id: true, name: true }

    await paginate(model, { limit: 10 }, { select })

    expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ select, take: 10 }))
    expect(model.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({ include: expect.anything() })
    )
  })

  it('passes include from options to findMany', async () => {
    const model = createMockModel(0)
    const include = { categories: true }

    await paginate(model, { limit: 10 }, { include })

    expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ include, take: 10 }))
  })

  it('prefers select over include when both are provided in options', async () => {
    const model = createMockModel(0)
    const select = { id: true }
    const include = { categories: true }

    await paginate(model, { limit: 10 }, { select, include })

    expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ select }))
    expect(model.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({ include: expect.anything() })
    )
  })

  it('merges options.where with term filters', async () => {
    const model = createMockModel(0)

    await paginate(
      model,
      { term: 'hello', filterBy: ['name'], orderBy: { order: 'asc' } },
      { where: { published: true } }
    )

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [{ published: true }, { name: { contains: 'hello', mode: 'insensitive' } }]
        },
        orderBy: [{ order: 'asc' }, { id: 'asc' }]
      })
    )
  })

  it('builds an OR filter when multiple filterBy keys are provided', async () => {
    const model = createMockModel(0)

    await paginate(model, { term: 'hello', filterBy: ['name', 'slug'] })

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: 'hello', mode: 'insensitive' } },
            { slug: { contains: 'hello', mode: 'insensitive' } }
          ]
        }
      })
    )
  })

  it('builds a JSON path filter for dotted filterBy keys', async () => {
    const model = createMockModel(0)

    await paginate(model, { term: 'hello', filterBy: ['name.en-US'] })

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          name: {
            path: ['en-US'],
            string_contains: 'hello',
            mode: 'insensitive'
          }
        }
      })
    )
  })

  it('ignores term when filterBy is empty', async () => {
    const model = createMockModel(0)

    await paginate(model, { term: 'hello', filterBy: [] })

    expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }))
  })

  it('coerces a single filterBy query value into an array', async () => {
    const model = createMockModel(0)

    await paginate(model, { term: 'hello', filterBy: 'name' })

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: { contains: 'hello', mode: 'insensitive' } }
      })
    )
  })
})
