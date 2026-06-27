import { SettingRepository } from '@src/admin/repositories/setting.repository.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import { Request, Response } from 'express'

function toSettingsMap(settings: Awaited<ReturnType<typeof SettingRepository.all>>) {
  return Object.fromEntries(settings.map(({ key, value }) => [key, value]))
}

export class SettingController {
  static async index(_req: Request, res: Response) {
    const settings = await SettingRepository.all()
    res.json(toSettingsMap(settings))
  }

  static async getByKey(req: Request<{ key: string }>, res: Response) {
    const { key } = req.params
    const setting = await SettingRepository.findByKey(key)

    if (!setting) {
      res.status(404).json({ message: 'Setting not found' })
      return
    }

    res.json(setting.value)
  }

  static async upsert(req: Request<{ key: string }>, res: Response) {
    const { key } = req.params
    const value = req.body as Prisma.InputJsonValue

    const setting = await SettingRepository.upsert(key, value)
    res.json(setting.value)
  }
}
