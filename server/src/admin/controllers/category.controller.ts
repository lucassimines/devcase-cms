import { CategoryRepository } from '@src/admin/repositories/category.repository.js'
import { prisma } from '@src/db.js'
import { parseCategoryTypeParam } from '@src/utils/category-type.utils.js'
import { paginate } from '@src/utils/paginate.utils.js'
import { reorder } from '@src/utils/reorder.utils.js'
import { Request, Response } from 'express'

type CategoryRouteParams = {
  type: string
  id?: string
}

function getCategoryType(req: Request<CategoryRouteParams>) {
  return parseCategoryTypeParam(req.params.type)
}

export class CategoryController {
  static async reorder(req: Request<CategoryRouteParams>, res: Response) {
    return res.json(await reorder(prisma.category, req.body))
  }

  static async all(req: Request<CategoryRouteParams>, res: Response) {
    const type = getCategoryType(req)

    res.json(await CategoryRepository.all(type))
  }

  static async index(req: Request<CategoryRouteParams>, res: Response) {
    const type = getCategoryType(req)

    res.json(
      await paginate(prisma.category, {
        ...req.query,
        where: { type }
      })
    )
  }

  static async getById(req: Request<CategoryRouteParams>, res: Response) {
    const type = getCategoryType(req)
    const id = req.params.id!

    res.json(await CategoryRepository.findById(id, type))
  }

  static async create(req: Request<CategoryRouteParams>, res: Response) {
    const type = getCategoryType(req)

    res.json(await CategoryRepository.create({ ...req.body, type }))
  }

  static async update(req: Request<CategoryRouteParams>, res: Response) {
    const type = getCategoryType(req)
    const id = req.params.id!

    res.json(await CategoryRepository.update(id, type, req.body))
  }

  static async deleteMany(req: Request<CategoryRouteParams>, res: Response) {
    const type = getCategoryType(req)

    res.json(await CategoryRepository.deleteMany(req.body.ids, type))
  }

  static async delete(req: Request<CategoryRouteParams>, res: Response) {
    const type = getCategoryType(req)
    const id = req.params.id!

    res.json(await CategoryRepository.delete(id, type))
  }
}
