import logger from '@src/utils/logger.utils.js'

const headerName = 'x-prerender-revalidate' as const

/**
 * Pings the public site so Vercel / Nuxt ISR can refresh.
 * Sends HEAD (or GET on 405) with `x-prerender-revalidate: <token>`.
 * No-op when `FRONT_URL` or `PRERENDER_REVALIDATE_TOKEN` are unset.
 */
export class RevalidateService {
  static async revalidateFrontend(): Promise<void> {
    const url = process.env.FRONT_URL
    const token = process.env.PRERENDER_REVALIDATE_TOKEN

    if (!url || !token) return

    const headers = { [headerName]: token }

    try {
      let res = await fetch(url, { method: 'GET', headers })
      if (res.status === 405) {
        res = await fetch(url, { method: 'HEAD', headers })
      }

      const cacheStatus = res.headers.get('x-vercel-cache') ?? 'unknown'
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        logger.error(
          'Frontend revalidate failed: status %d cache=%s %s',
          res.status,
          cacheStatus,
          text
        )
        return
      }

      logger.info('Frontend revalidate ok: status %d cache=%s url=%s', res.status, cacheStatus, url)
    } catch (err) {
      logger.error('Frontend revalidate request error: %o', err)
    }
  }
}
