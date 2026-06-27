import { PostController } from '@src/admin/controllers/post.controller.js'
import { Router } from 'express'

import postCategoryRouter from './post-category.route.js'

const router = Router()

router.use('/category', postCategoryRouter)

router.put('/reorder', PostController.reorder)
router.get('/', PostController.index)
router.post('/', PostController.create)
router.get('/:id', PostController.getById)
router.put('/:id', PostController.update)
router.delete('/', PostController.deleteMany)
router.delete('/:id', PostController.delete)

export default router
