import { ProjectController } from '@src/admin/controllers/project.controller.js'
import { Router } from 'express'

const router = Router()

router.put('/reorder', ProjectController.reorder)
router.get('/', ProjectController.index)
router.post('/', ProjectController.create)
router.get('/:id', ProjectController.getById)
router.put('/:id', ProjectController.update)
router.delete('/', ProjectController.deleteMany)
router.delete('/:id', ProjectController.delete)

export default router
