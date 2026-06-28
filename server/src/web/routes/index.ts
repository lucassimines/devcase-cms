import { Router } from 'express'

import bootstrap from './bootstrap.route.js'
import health from './health.route.js'
import page from './page.route.js'
import post from './post.route.js'
import project from './project.route.js'
import sitemap from './sitemap.route.js'

const router = Router()

const routes = [
  ['bootstrap', bootstrap],
  ['health', health],
  ['pages', page],
  ['posts', post],
  ['projects', project],
  ['sitemap', sitemap]
] as const

for (const [path, route] of routes) {
  router.use(`/${path}`, route)
}

export default router
