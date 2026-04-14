import { prisma } from '@src/db.js'
import { Router } from 'express'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({ status: 'ok' })
  } catch (err) {
    res.status(503).json({ status: 'unavailable' })
  }
})

export default router
