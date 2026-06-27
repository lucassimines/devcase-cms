import { CategoryRepository } from '@src/admin/repositories/category.repository.js'
import { CategoryType } from '@src/generated/prisma/client.js'
import { prisma } from '@src/db.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { reorder } from '@src/utils/reorder.utils.js'
import { Request, Response } from 'express'

const POST_CATEGORY_TYPE = CategoryType.POST

export class CategoryController {
  static async reorder(req: Request, res: Response) {
    return res.json(await reorder(prisma.category, req.body))
  }

  static async all(_req: Request, res: Response) {
    res.json(await CategoryRepository.all(POST_CATEGORY_TYPE))
  }

  static async index(req: Request, res: Response) {
    res.json(
      await paginate(prisma.category, {
        ...req.query,
        where: { type: POST_CATEGORY_TYPE }
      })
    )
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await CategoryRepository.findById(id, POST_CATEGORY_TYPE))
  }

  static async create(req: Request, res: Response) {
    res.json(await CategoryRepository.create({ ...req.body, type: POST_CATEGORY_TYPE }))
  }

  static async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await CategoryRepository.update(id, POST_CATEGORY_TYPE, req.body))
  }

  static async deleteMany(req: Request, res: Response) {
    res.json(await CategoryRepository.deleteMany(req.body.ids, POST_CATEGORY_TYPE))
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    res.json(await CategoryRepository.delete(id, POST_CATEGORY_TYPE))
  }
}
