import logger from '@src/utils/logger.utils.js'
import { staticDirectory } from '@src/utils/storage-path.utils.js'
import { prisma } from '@src/db.js'
import dotenv from 'dotenv'
import type { Server } from 'node:http'
import * as path from 'path'
import { createApp } from './app.js'

const envFile = path.resolve(process.cwd(), process.env.ENV || '.env')
dotenv.config({ path: envFile })

dotenv.config()

const port = Number(process.env.PORT) || 3000
const basePath = process.env.API_BASE_PATH
const app = await createApp()

const server: Server = app.listen(port, '0.0.0.0', () => {
  logger.info('Listening on port %d with base path %s serving static from %s', port, basePath, staticDirectory)

  void prisma
    .$connect()
    .then(() => logger.info('Database connected'))
    .catch((err) => logger.error('Database connection failed: %o', err))
})

function shutdown(signal: string) {
  logger.info('%s received, shutting down', signal)

  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0))
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
