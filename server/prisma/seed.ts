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

  // Seed Project
  await prisma.project.createMany({
    data: [
      {
        name: 'Project 1',
        published: true,
        description: 'Project 1 description',
        url: 'https://github.com',
        // unsplash
        image: 'https://unsplash.com/photos/an-aerial-view-of-the-city-of-london-65kwzlfW6QI',
        slug: 'project-1',
        blocks: [
          {
            type: 'text',
            content: 'Project 1 content'
          }
        ]
      }
    ]
  })
}

main()
