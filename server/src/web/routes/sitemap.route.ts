import { SitemapController } from '@src/web/controllers/sitemap.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', SitemapController.index)
router.get('/:name', SitemapController.show)

export default router
