import { SettingController } from '@src/admin/controllers/setting.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', SettingController.index)
router.get('/:key', SettingController.getByKey)
router.put('/:key', SettingController.upsert)

export default router
