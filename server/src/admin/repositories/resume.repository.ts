import { prisma } from '@src/db.js'
import { emptyLocalizedString, toLocalizedString } from '@src/utils/localized-json.utils.js'
import type { Prisma } from '@src/generated/prisma/client.js'

export class ResumeRepository {
  static findFirst() {
    return prisma.resume.findFirst()
  }

  static async getOrCreate() {
    const existing = await prisma.resume.findFirst()

    if (existing) return existing

    return prisma.resume.create({
      data: { content: emptyLocalizedString() }
    })
  }

  static async upsert(content: unknown) {
    const value = toLocalizedString(content) as Prisma.InputJsonValue
    const existing = await prisma.resume.findFirst()

    if (existing) {
      return prisma.resume.update({
        where: { id: existing.id },
        data: { content: value }
      })
    }

    return prisma.resume.create({
      data: { content: value }
    })
  }
}
