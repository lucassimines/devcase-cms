import errorMiddleware from '@src/middlewares/error.middleware.js'
import { staticDirectory } from '@src/utils/storage-path.utils.js'
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

app.use(errorMiddleware)

app.listen(port, () => {
  logger.info('Listening on port %d with base path %s serving static from %s', port, basePath, staticDirectory)
})
