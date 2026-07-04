import { prisma } from '@src/db.js'
import { Router } from 'express'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({ status: 'ok', db: 'ok' })
  } catch {
    // Keep the process alive for Railway; report DB status in the body.
    res.status(200).json({ status: 'ok', db: 'unavailable' })
  }
})

export default router
