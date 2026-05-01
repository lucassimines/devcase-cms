import { prisma } from '@src/db.js'
import type { UserUpdateInput } from '@src/generated/prisma/models.js'
import type { AuthUser } from '@src/types/auth.js'
import bcrypt from 'bcryptjs'

const bcryptSalt = Number(process.env.BCRYPT_SALT) || 10

export class UserRepository {
  static async update(user: AuthUser, data: UserUpdateInput) {
    if (data.password) {
      // Hash the password
      data.password = await bcrypt.hash(data.password.toString(), bcryptSalt)
    }

    prisma.user.update({
      where: { id: user.id },
      data
    })
  }
}
