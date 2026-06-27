import type { AuthUser } from '@src/types/auth.js'

declare global {
  namespace Express {
    interface Request {
      user: AuthUser
    }
  }
}

export {}
