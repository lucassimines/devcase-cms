import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'

export class SettingRepository {
  static all() {
    return prisma.setting.findMany()
  }

  static findByKey(key: string) {
    return prisma.setting.findUnique({
      where: { key }
    })
  }

  static async upsert(key: string, value: Prisma.InputJsonValue) {
    const setting = await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value }
    })

    WebCacheInvalidation.bootstrap()

    return setting
  }
}
