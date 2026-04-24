import { SolutionController } from '@src/admin/controllers/solution.controller.js'
import { Router } from 'express'

const router = Router()

router.put('/reorder', SolutionController.reorder)
router.get('/', SolutionController.index)
router.post('/', SolutionController.create)
router.get('/all', SolutionController.all)
router.get('/:id', SolutionController.getById)
router.put('/:id', SolutionController.update)
router.delete('/', SolutionController.deleteMany)
router.delete('/:id', SolutionController.delete)

export default router
