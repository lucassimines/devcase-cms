import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'

export class SettingRepository {
  static all() {
    return prisma.setting.findMany()
  }

  static findByKey(key: string) {
    return prisma.setting.findUnique({
      where: { key }
    })
  }

  static upsert(key: string, value: Prisma.InputJsonValue) {
    return prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value }
    })
  }
}
