import logger from '@src/utils/logger.utils.js'

const headerName = 'x-prerender-revalidate' as const

/**
 * Pings the public site so Vercel / Nuxt ISR can refresh.
 * Sends HEAD (or GET on 405) with `x-prerender-revalidate: <token>`.
 * No-op when revalidate URL or token are unset.
 */
export class RevalidateService {
  static async revalidateFrontend(): Promise<void> {
    const url = process.env.FRONTEND_URL
    const token = process.env.PRERENDER_REVALIDATE_TOKEN

    if (!url || !token) {
      return
    }

    const headers = { [headerName]: token }

    try {
      let method: 'HEAD' | 'GET' = 'HEAD'
      let res = await fetch(url, { method, headers })
      if (res.status === 405) {
        method = 'GET'
        res = await fetch(url, { method, headers })
      }

      const cacheStatus = res.headers.get('x-vercel-cache') ?? 'unknown'
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        logger.error(
          'Frontend revalidate failed: %s %s status=%d cache=%s %s',
          method,
          url,
          res.status,
          cacheStatus,
          text
        )
        return
      }

      logger.info(
        'Frontend revalidate ok: %s %s status=%d cache=%s',
        method,
        url,
        res.status,
        cacheStatus
      )
    } catch (err) {
      logger.error('Frontend revalidate request error (%s): %o', url, err)
    }
  }

  /**
   * Warm-then-swap sitemap LKG on the frontend.
   * Best-effort: logs failures and never throws.
   */
  static async revalidateSitemap(): Promise<void> {
    const baseUrl = process.env.FRONTEND_URL
    const token = process.env.PRERENDER_REVALIDATE_TOKEN

    if (!baseUrl || !token) {
      return
    }

    const url = `${baseUrl.replace(/\/$/, '')}/api/revalidate/sitemap`
    const headers = {
      [headerName]: token,
      'content-type': 'application/json'
    }

    try {
      const res = await fetch(url, { method: 'POST', headers })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        logger.error(
          'Frontend sitemap revalidate failed: POST %s status=%d %s',
          url,
          res.status,
          text
        )
        return
      }

      logger.info('Frontend sitemap revalidate ok: POST %s status=%d', url, res.status)
    } catch (err) {
      logger.error('Frontend sitemap revalidate request error (%s): %o', url, err)
    }
  }
}
