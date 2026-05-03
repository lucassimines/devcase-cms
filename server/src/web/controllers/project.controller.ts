import { ProjectService } from '@src/web/services/project.service.js'
import { NotFoundError } from '@src/errors/index.js'
import { Request, Response } from 'express'

export class ProjectController {
  static async featured(_req: Request, res: Response) {
    res.json(await ProjectService.featured())
  }

  static async paginatedList(_req: Request, res: Response) {
    res.json(await ProjectService.paginatedList())
  }

  static async getBySlug(req: Request<{ slug: string }>, res: Response) {
    const { slug } = req.params

    const project = await ProjectService.findBySlug(slug)

    if (!project) {
      throw new NotFoundError('Project not found')
    }

    res.json(project)
  }
}
