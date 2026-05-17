import { NotFoundError } from '@src/errors/index.js'
import { ProjectService } from '@src/web/services/project.service.js'
import { Request, Response } from 'express'

export class ProjectController {
  static async index(_req: Request, res: Response) {
    res.json(await ProjectService.paginatedList())
  }

  static async featured(_req: Request, res: Response) {
    res.json(await ProjectService.featured())
  }

  static async show(req: Request<{ slug: string }>, res: Response) {
    const { slug } = req.params

    const [project, nextProject] = await Promise.all([
      ProjectService.findBySlug(slug),
      ProjectService.findNextProject(slug)
    ])

    if (!project) {
      throw new NotFoundError('Project not found')
    }

    res.json({
      data: project,
      meta: {
        next: nextProject
      }
    })
  }
}
