import { TechnologyRepository } from '@src/admin/repositories/technology.repository.js'
import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { Request, Response } from 'express'

export class TechnologyController {
  static async index(req: Request, res: Response) {
    res.json(await paginate(prisma.technology, req.query))
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params
    console.log(id)

    res.json(await TechnologyRepository.findById(id))
  }

  static async create(req: Request, res: Response) {
    res.json(await TechnologyRepository.create(req.body))
  }

  static async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await TechnologyRepository.update(id, req.body))
  }

  static async deleteMany(req: Request, res: Response) {
    res.json(await TechnologyRepository.deleteMany(req.body.ids))
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await TechnologyRepository.delete(id))
  }
}
