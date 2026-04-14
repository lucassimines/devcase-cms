import { ProjectService } from '@src/client/services/project.service.js'
import { Request, Response } from 'express'

export class ProjectController {
  static async featured(_req: Request, res: Response) {
    const projects = await ProjectService.featured()

    res.json(projects)
  }
}
