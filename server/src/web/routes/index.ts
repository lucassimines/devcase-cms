import { Router } from 'express'

import health from './health.route.js'
import project from './project.route.js'

const router = Router()

const routes = [
  ['health', health],
  ['projects', project]
] as const

for (const [path, route] of routes) {
  router.use(`/${path}`, route)
}

export default router
