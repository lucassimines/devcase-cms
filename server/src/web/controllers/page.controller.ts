import { PageService } from '@src/web/services/page.service.js'
import { NotFoundError } from '@src/errors/index.js'
import { Request, Response } from 'express'

export class PageController {
  static async getBySlug(req: Request<{ slug: string }>, res: Response) {
    const { slug } = req.params

    const page = await PageService.findBySlug(slug)

    if (!page) {
      throw new NotFoundError('Page not found')
    }

    res.json(page)
  }
}
