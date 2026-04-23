import { ProjectController } from '@src/web/controllers/project.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/featured', ProjectController.featured)
router.get('/list', ProjectController.paginatedList)
router.get('/:slug', ProjectController.getBySlug)

export default router
