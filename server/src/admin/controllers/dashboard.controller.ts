import { DashboardRepository } from '@src/admin/repositories/dashboard.repository.js'
import { Request, Response } from 'express'

export class DashboardController {
  static async index(_req: Request, res: Response) {
    return res.json(await DashboardRepository.getStats())
  }
}
