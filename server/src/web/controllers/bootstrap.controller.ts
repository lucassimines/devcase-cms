import { BootstrapService } from '@src/web/services/bootstrap.service.js'
import { Request, Response } from 'express'

export class BootstrapController {
  static async index(_req: Request, res: Response) {
    res.json(await BootstrapService.index())
  }
}
