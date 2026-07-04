import { PostCategoryService } from '@src/web/services/post-category.service.js'
import type { Request, Response } from 'express'

export class PostCategoryController {
  static async index(_req: Request, res: Response) {
    res.json(await PostCategoryService.all())
  }
}
