import { describe, expect, it, vi } from 'vitest'

import type { PrismaDelegate } from '@src/types/prisma.js'
import { MAX_PAGE_LIMIT, paginate } from '@src/utils/paginate.utils.js'

function createMockModel(total: number): PrismaDelegate {
  return {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(total)
  }
}

describe('paginate.utils', () => {
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

  it('ignores include, select, and where passed in query', async () => {
    const model = createMockModel(0)
    const select = { id: true, name: true }

    await paginate(model, {
      limit: 10,
      include: { categories: true },
      select,
      where: { published: true },
      orderBy: { slug: 'asc' }
    })

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
})
