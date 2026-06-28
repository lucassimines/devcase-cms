import { PostController } from '@src/web/controllers/post.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', PostController.index)
router.get('/:slug', PostController.show)

export default router
