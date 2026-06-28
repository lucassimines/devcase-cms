import { NotFoundError } from '@src/errors/index.js'
import { PostService } from '@src/web/services/post.service.js'
import { Request, Response } from 'express'

export class PostController {
  static async index(req: Request, res: Response) {
    res.json(await PostService.paginatedList(req.query))
  }

  static async show(req: Request<{ slug: string }>, res: Response) {
    const { slug } = req.params

    const post = await PostService.findBySlug(slug)

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    const nextPost = await PostService.findNextPost(post.order, post.slug)

    res.json({
      data: post,
      meta: {
        next: nextPost
      }
    })
  }
}
