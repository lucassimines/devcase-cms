import { CategoryController } from '@src/admin/controllers/category.controller.js'
import { Router } from 'express'

const router = Router()

router.put('/reorder', CategoryController.reorder)
router.get('/all', CategoryController.all)
router.get('/', CategoryController.index)
router.post('/', CategoryController.create)
router.get('/:id', CategoryController.getById)
router.put('/:id', CategoryController.update)
router.delete('/', CategoryController.deleteMany)
router.delete('/:id', CategoryController.delete)

export default router
