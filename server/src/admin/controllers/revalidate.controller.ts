import { RevalidateService } from '@src/admin/services/revalidate.service.js'
import type { Request, Response } from 'express'

export class RevalidateController {
  static async revalidate(_req: Request, res: Response) {
    await RevalidateService.revalidateFrontend()
    res.status(204).send()
  }
}
