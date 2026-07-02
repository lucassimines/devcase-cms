import bcrypt from 'bcryptjs'
import type { Express } from 'express'
import request from 'supertest'

import { prismaRaw } from '@src/db.js'

import { TEST_ENV, TEST_USER } from '@tests/env'

export async function seedTestUser() {
  await prismaRaw.user.upsert({
    where: { email: TEST_USER.email },
    create: {
      email: TEST_USER.email,
      name: TEST_USER.name,
      password: await bcrypt.hash(TEST_USER.password, 10)
    },
    update: {
      name: TEST_USER.name,
      password: await bcrypt.hash(TEST_USER.password, 10)
    }
  })
}

export async function loginAsTestUser(app: Express) {
  const res = await request(app)
    .post(`${TEST_ENV.API_BASE_PATH}/auth/login`)
    .send({ email: TEST_USER.email, password: TEST_USER.password })
    .expect(200)

  return res.body.accessToken as string
}
