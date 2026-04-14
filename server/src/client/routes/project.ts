import { ProjectController } from '@src/client/controllers/project.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/featured', ProjectController.featured)

export default router
