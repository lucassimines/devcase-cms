import { PageController } from '@src/web/controllers/page.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/:slug', PageController.getBySlug)

export default router
