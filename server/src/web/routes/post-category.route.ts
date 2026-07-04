import { PostCategoryController } from '@src/web/controllers/post-category.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', PostCategoryController.index)

export default router
