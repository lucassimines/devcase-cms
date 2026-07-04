import { NotFoundError } from '@src/errors/index.js'
import { PostCategoryService } from '@src/web/services/post-category.service.js'
import type { Request, Response } from 'express'

export class PostCategoryController {
  static async index(_req: Request, res: Response) {
    res.json(await PostCategoryService.all())
  }

  static async show(req: Request<{ slug: string }>, res: Response) {
    const category = await PostCategoryService.findBySlug(req.params.slug)

    if (!category) {
      throw new NotFoundError('Category not found')
    }

    res.json(category)
  }
}
