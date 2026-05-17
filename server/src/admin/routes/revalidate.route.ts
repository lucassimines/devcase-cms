import { RevalidateController } from '@src/admin/controllers/revalidate.controller.js'
import { Router } from 'express'

const router = Router()

router.post('/', RevalidateController.revalidate)

export default router
