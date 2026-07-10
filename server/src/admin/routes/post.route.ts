import { PostController } from '@src/admin/controllers/post.controller.js'
import { Router } from 'express'

const router = Router()

router.put('/reorder', PostController.reorder)
router.get('/', PostController.index)
router.post('/generate', PostController.generate)
router.post('/', PostController.create)
router.post('/:id/generate-image', PostController.generateImage)
router.get('/:id', PostController.getById)
router.put('/:id', PostController.update)
router.delete('/', PostController.deleteMany)
router.delete('/:id', PostController.delete)

export default router
