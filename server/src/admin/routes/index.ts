import { VerifyApiTokenMiddleware } from '@src/admin/middleware/verify-api-token.middleware.js'
import { requestContext } from '@src/request-context.js'
import { Router } from 'express'

import dashboardRouter from './dashboard.route.js'
import fileRouter from './file.route.js'
import projectRouter from './project.route.js'
import solutionRouter from './solution.route.js'
import technologyRouter from './technology.route.js'
import userRouter from './user.route.js'

const router = Router()

router.use(VerifyApiTokenMiddleware)
router.use((req, _res, next) => {
  requestContext.run({ userId: req.user.id }, next)
})

const routes = [
  ['dashboard', dashboardRouter],
  ['file', fileRouter],
  ['user', userRouter],
  ['project', projectRouter],
  ['solution', solutionRouter],
  ['technology', technologyRouter]
] as const

for (const [path, route] of routes) {
  router.use(`/${path}`, route)
}

export default router
