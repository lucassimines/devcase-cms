import { PageRepository } from '@src/admin/repositories/page.repository.js'
import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { Request, Response } from 'express'

export class PageController {
  static async index(req: Request, res: Response) {
    res.json(await paginate(prisma.page, req.query))
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await PageRepository.findById(id))
  }

  static async create(req: Request, res: Response) {
    res.json(await PageRepository.create(req.body))
  }

  static async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await PageRepository.update(id, req.body))
  }

  static async deleteMany(req: Request, res: Response) {
    res.json(await PageRepository.deleteMany(req.body.ids))
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await PageRepository.delete(id))
  }
}
