import { PageService } from '@src/web/services/page.service.js'
import { Request, Response } from 'express'

export class PageController {
  static async getBySlug(req: Request<{ slug: string }>, res: Response) {
    const { slug } = req.params

    res.json(await PageService.findBySlug(slug))
  }
}
