import { ResumeController } from '@src/web/controllers/resume.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', ResumeController.show)

export default router
