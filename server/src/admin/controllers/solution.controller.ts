import { SolutionRepository } from '@src/admin/repositories/solution.repository.js'
import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { reorder } from '@src/utils/reorder.utils.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'
import { Request, Response } from 'express'

export class SolutionController {
  static async reorder(req: Request, res: Response) {
    const result = await reorder(prisma.solution, req.body)

    WebCacheInvalidation.projects()

    return res.json(result)
  }

  static async all(_req: Request, res: Response) {
    res.json(await SolutionRepository.all())
  }

  static async index(req: Request, res: Response) {
    res.json(await paginate(prisma.solution, req.query))
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await SolutionRepository.findById(id))
  }

  static async create(req: Request, res: Response) {
    res.json(await SolutionRepository.create(req.body))
  }

  static async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await SolutionRepository.update(id, req.body))
  }

  static async deleteMany(req: Request, res: Response) {
    res.json(await SolutionRepository.deleteMany(req.body.ids))
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await SolutionRepository.delete(id))
  }
}
