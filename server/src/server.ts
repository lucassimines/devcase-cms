import errorMiddleware from '@src/middlewares/error.middleware.js'
import logger from '@src/utils/logger.utils.js'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import * as path from 'path'

// Load .env file first
const envFile = path.resolve(process.cwd(), process.env.ENV || '.env')
dotenv.config({ path: envFile })

dotenv.config()

const app = express()

const port = process.env.PORT || 3000

// @TODO: change origin for production
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const basePath = process.env.API_BASE_PATH

// Serve static files
app.use(`${basePath}/static`, express.static('public'))

const [{ default: authRouter }, { default: adminRouter }, { default: clientRouter }] =
  await Promise.all([
    import('./admin/routes/auth.route.js'),
    import('./admin/routes/index.js'),
    import('./client/routes/index.js')
  ])

app.use(`${basePath}/auth`, authRouter)
app.use(`${basePath}/admin`, adminRouter)
app.use(`${basePath}`, clientRouter)

app.use(errorMiddleware)

app.listen(port, () => {
  logger.info('Listening on port %d with base path %s', port, basePath)
})
