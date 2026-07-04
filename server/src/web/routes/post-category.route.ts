import { PostCategoryController } from '@src/web/controllers/post-category.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', PostCategoryController.index)
router.get('/:slug', PostCategoryController.show)

export default router
