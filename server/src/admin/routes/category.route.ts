import { CategoryController } from '@src/admin/controllers/category.controller.js'
import { parseCategoryTypeParam } from '@src/utils/category-type.utils.js'
import { Router } from 'express'

const typeRouter = Router({ mergeParams: true })

typeRouter.put('/reorder', CategoryController.reorder)
typeRouter.get('/all', CategoryController.all)
typeRouter.get('/', CategoryController.index)
typeRouter.post('/', CategoryController.create)
typeRouter.get('/:id', CategoryController.getById)
typeRouter.put('/:id', CategoryController.update)
typeRouter.delete('/', CategoryController.deleteMany)
typeRouter.delete('/:id', CategoryController.delete)

const router = Router()

router.param('type', (_req, res, next, type) => {
  try {
    parseCategoryTypeParam(type)
    next()
  } catch {
    res.status(404).json({ message: `Invalid category type: ${type}` })
  }
})

router.use('/:type', typeRouter)

export default router
