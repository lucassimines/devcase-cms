import { ProjectController } from '@src/web/controllers/project.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', ProjectController.index)
router.get('/featured', ProjectController.featured)
router.get('/:slug', ProjectController.show)

export default router
