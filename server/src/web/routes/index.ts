import { Router } from 'express'

import bootstrap from './bootstrap.route.js'
import health from './health.route.js'
import page from './page.route.js'
import project from './project.route.js'

const router = Router()

const routes = [
  ['bootstrap', bootstrap],
  ['health', health],
  ['pages', page],
  ['projects', project]
] as const

for (const [path, route] of routes) {
  router.use(`/${path}`, route)
}

export default router
