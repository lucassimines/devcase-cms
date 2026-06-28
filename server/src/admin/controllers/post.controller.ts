import { PostRepository } from '@src/admin/repositories/post.repository.js'
import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { reorder } from '@src/utils/reorder.utils.js'
import { Request, Response } from 'express'

export class PostController {
  static async reorder(req: Request, res: Response) {
    return res.json(await reorder(prisma.post, req.body))
  }

  static async index(req: Request, res: Response) {
    res.json(await paginate(prisma.post, req.query))
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await PostRepository.findById(id))
  }

  static async create(req: Request, res: Response) {
    res.json(await PostRepository.create(req.body))
  }

  static async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await PostRepository.update(id, req.body))
  }

  static async deleteMany(req: Request, res: Response) {
    res.json(await PostRepository.deleteMany(req.body.ids))
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await PostRepository.delete(id))
  }
}
