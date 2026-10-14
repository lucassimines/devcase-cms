import { ResumeController } from '@src/admin/controllers/resume.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', ResumeController.show)
router.put('/', ResumeController.upsert)

export default router
