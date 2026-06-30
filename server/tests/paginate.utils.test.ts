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
})
