import { ProjectService } from '@src/web/services/project.service.js'
import { Request, Response } from 'express'

export class ProjectController {
  static async featured(_req: Request, res: Response) {
    res.json(await ProjectService.featured())
  }

  static async getBySlug(req: Request<{ slug: string }>, res: Response) {
    const { slug } = req.params

    res.json(await ProjectService.findBySlug(slug))
  }
}
