import errorMiddleware from '@src/middlewares/error.middleware.js'
import { NotFoundError } from '@src/errors/index.js'
import { staticDirectory } from '@src/utils/storage-path.utils.js'
import cors from 'cors'
import express from 'express'

export async function createApp() {
  const app = express()

  app.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.use(cors({ origin: true, credentials: true }))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  const basePath = process.env.API_BASE_PATH

  app.use(`${basePath}/static`, express.static(staticDirectory))

  const [{ default: authRouter }, { default: adminRouter }, { default: webRouter }] =
    await Promise.all([
      import('./admin/routes/auth.route.js'),
      import('./admin/routes/index.js'),
      import('./web/routes/index.js')
    ])

  app.use(`${basePath}/auth`, authRouter)
  app.use(`${basePath}/admin`, adminRouter)
  app.use(`${basePath}`, webRouter)

  app.use((_req, _res, next) => {
    next(new NotFoundError('Route not found'))
  })

  app.use(errorMiddleware)

  return app
}
