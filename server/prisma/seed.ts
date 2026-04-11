import bcrypt from 'bcryptjs'
import { prisma } from '../src/db'

const bcryptSalt = Number(process.env.BCRYPT_SALT) || 10

async function main() {
  // Seed User
  await prisma.user.createMany({
    data: [
      {
        email: 'lucas.simines@gmail.com',
        name: 'Lucas Simines',
        password: await bcrypt.hash('000000', bcryptSalt)
      }
    ]
  })

  const user = await prisma.user.findFirst({
    where: {
      email: 'lucas.simines@gmail.com'
    }
  })
}

main()
