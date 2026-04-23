import { BootstrapController } from '@src/web/controllers/bootstrap.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', BootstrapController.index)

export default router
