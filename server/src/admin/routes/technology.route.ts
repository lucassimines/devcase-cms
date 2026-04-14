import { TechnologyController } from '@src/admin/controllers/technology.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', TechnologyController.index)
router.post('/', TechnologyController.create)
router.get('/all', TechnologyController.all)
router.get('/:id', TechnologyController.getById)
router.put('/:id', TechnologyController.update)
router.delete('/', TechnologyController.deleteMany)
router.delete('/:id', TechnologyController.delete)

export default router
