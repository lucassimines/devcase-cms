import type { PrismaDelegate } from '@src/types/prisma.js'

type Item = {
  id: string
  order: number
}

export async function reorder<T extends PrismaDelegate>(model: T, items: Item[]) {
  const updatePromises = items.map((item) =>
    model.update({
      where: { id: item.id },
      data: { order: item.order }
    })
  )

  return await Promise.all(updatePromises)
}
