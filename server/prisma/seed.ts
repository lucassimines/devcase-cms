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

  // Seed Technology
  await prisma.technology.createMany({
    data: [
      {
        name: 'Nuxt',
        slug: 'nuxt'
      },
      {
        name: 'Vue',
        slug: 'vue'
      },
      {
        name: 'Tailwind CSS',
        slug: 'tailwind-css'
      },
      {
        name: 'TypeScript',
        slug: 'typescript'
      },
      {
        name: 'JavaScript',
        slug: 'javascript'
      },
      {
        name: 'PostgreSQL',
        slug: 'postgresql'
      },
      {
        name: 'MySQL',
        slug: 'mysql'
      },
      {
        name: 'Express.js',
        slug: 'expressjs'
      },
      {
        name: 'Node.js',
        slug: 'nodejs'
      },
      {
        name: 'Docker',
        slug: 'docker'
      },
      {
        name: 'Prisma',
        slug: 'prisma'
      },
      {
        name: 'Laravel',
        slug: 'laravel'
      },
      {
        name: 'PHP',
        slug: 'php'
      },
      {
        name: 'HTML',
        slug: 'html'
      },
      {
        name: 'CSS',
        slug: 'css'
      },
      {
        name: 'React',
        slug: 'react'
      },
      {
        name: 'Next.js',
        slug: 'nextjs'
      },
      {
        name: 'Vercel',
        slug: 'vercel'
      },
      {
        name: 'AWS',
        slug: 'aws'
      },
      {
        name: 'Digital Ocean',
        slug: 'digital-ocean'
      }
    ]
  })
}

main()
