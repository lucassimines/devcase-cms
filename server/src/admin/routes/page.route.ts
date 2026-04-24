import { PageController } from '@src/admin/controllers/page.controller.js'
import { Router } from 'express'

const router = Router()

router.put('/reorder', PageController.reorder)
router.get('/', PageController.index)
router.post('/', PageController.create)
router.get('/:id', PageController.getById)
router.put('/:id', PageController.update)
router.delete('/', PageController.deleteMany)
router.delete('/:id', PageController.delete)

export default router
