import { ProjectRepository } from '@src/admin/repositories/project.repository.js'
import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { Request, Response } from 'express'

export class ProjectController {
  static async index(req: Request, res: Response) {
    res.json(await paginate(prisma.project, req.query))
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await ProjectRepository.findById(id))
  }

  static async create(req: Request, res: Response) {
    res.json(await ProjectRepository.create(req.body))
  }

  static async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await ProjectRepository.update(id, req.body))
  }

  static async deleteMany(req: Request, res: Response) {
    res.json(await ProjectRepository.deleteMany(req.body.ids))
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await ProjectRepository.delete(id))
  }
}
