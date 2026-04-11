import { prisma } from '@src/db.js'
import { BadRequestError, NotFoundError, UnauthorizedError } from '@src/errors/index.js'
import type { AuthUser } from '@src/types/auth.js'
import { parseNonEmptyString } from '@src/utils/predicates.utils.js'
import TokenHelper from '@src/utils/token.utils.js'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'

const bcryptSalt = Number(process.env.BCRYPT_SALT) || 10

export class AuthController {
  private static generateTokens(user: AuthUser) {
    // Generate a new access token
    const accessToken = TokenHelper.createAccessToken({
      id: user.id,
      email: user.email
    })

    // Renew the refresh token
    const refreshToken = TokenHelper.createRefreshToken({
      id: user.id,
      email: user.email
    })

    return {
      accessToken,
      refreshToken
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new NotFoundError()
    }

    // Validate password
    const passwordIsValid = await bcrypt.compare(password, user.password)

    if (!passwordIsValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const { accessToken, refreshToken } = AuthController.generateTokens({
      id: user.id,
      email: user.email
    })

    // Remove user's password from the response
    const { password: _, ...userWithoutPassword } = user

    res.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    })
  }

  static async signup(req: Request, res: Response) {
    const { name, email, password } = req.body

    const user = await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, bcryptSalt) }
    })

    res.json(user)
  }

  static async fetchAuthenticatedUser(req: Request, res: Response) {
    const refreshToken = parseNonEmptyString(req.query.token)

    let authUser: AuthUser

    if (!refreshToken) {
      throw new BadRequestError('Missing token')
    }

    try {
      authUser = TokenHelper.verifyRefreshToken(refreshToken)
    } catch {
      throw new UnauthorizedError('Invalid token')
    }

    const user = await prisma.user.findUnique({
      omit: { password: true },
      where: { id: authUser?.id }
    })

    if (!user) {
      throw new NotFoundError()
    }

    res.json(user)
  }

  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new BadRequestError('Missing refresh token')
    }

    let authUser: AuthUser

    try {
      // Validate the refresh token
      authUser = TokenHelper.verifyRefreshToken(refreshToken)
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }

    if (!authUser) {
      throw new NotFoundError()
    }

    const tokens = AuthController.generateTokens(authUser)

    return res.json(tokens)
  }
}
