import logger from '@src/utils/logger.utils.js'

const headerName = 'x-prerender-revalidate' as const

/**
 * Pings the public site so prerender / ISR can refresh.
 * Sends HEAD (or GET on 405) with `x-prerender-revalidate: <token>` — most hosts accept either.
 * No-op when `FRONTEND_REVALIDATE_URL` or `PRERENDER_REVALIDATE_TOKEN` are unset.
 */
export class RevalidateService {
  static async revalidateFrontend(): Promise<void> {
    const url = process.env.FRONT_URL
    const token = process.env.VERCEL_BYPASS_TOKEN

    if (!url || !token) return

    const headers = { [headerName]: token }

    try {
      let res = await fetch(url, { method: 'HEAD', headers })
      if (res.status === 405) {
        res = await fetch(url, { method: 'GET', headers })
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        logger.error('Frontend revalidate failed: status %d %s', res.status, text)
      }
    } catch (err) {
      logger.error('Frontend revalidate request error: %o', err)
    }
  }
}
