import type { Express } from 'express'
import request from 'supertest'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { createApp } from '@src/app.js'
import { prismaRaw } from '@src/db.js'

import { TEST_ENV } from '@tests/env'
import { prepareTestDatabase } from '@tests/helpers/database'
import { loginAsTestUser, seedTestUser } from '@tests/helpers/auth'

const basePath = TEST_ENV.API_BASE_PATH

describe('Post admin API', () => {
  let app: Express

  beforeAll(async () => {
    await prepareTestDatabase()
    app = await createApp()
    await seedTestUser()
  })

  afterEach(async () => {
    await prismaRaw.post.deleteMany()
  })

  describe('POST /admin/post', () => {
    it('creates a post with localized title and slug', async () => {
      const token = await loginAsTestUser(app)

      const res = await request(app)
        .post(`${basePath}/admin/post`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { 'en-US': 'Hello World', 'pt-BR': 'Olá Mundo' },
          slug: 'hello-world'
        })
        .expect(200)

      expect(res.body).toMatchObject({
        title: { 'en-US': 'Hello World', 'pt-BR': 'Olá Mundo' },
        slug: 'hello-world',
        published: false,
        order: 0
      })
      expect(res.body.id).toBeTruthy()
    })

    it('requires authentication', async () => {
      await request(app)
        .post(`${basePath}/admin/post`)
        .send({
          title: { 'en-US': 'Private', 'pt-BR': '' },
          slug: 'private'
        })
        .expect(400)
    })
  })

  describe('GET /admin/post/:id', () => {
    it('returns a created post by id', async () => {
      const token = await loginAsTestUser(app)

      const created = await request(app)
        .post(`${basePath}/admin/post`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { 'en-US': 'My Post', 'pt-BR': 'Meu Post' },
          slug: 'my-post'
        })
        .expect(200)

      const res = await request(app)
        .get(`${basePath}/admin/post/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body).toMatchObject({
        id: created.body.id,
        slug: 'my-post'
      })
    })
  })

  describe('DELETE /admin/post/:id', () => {
    it('deletes a post', async () => {
      const token = await loginAsTestUser(app)

      const created = await request(app)
        .post(`${basePath}/admin/post`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { 'en-US': 'Temporary', 'pt-BR': '' },
          slug: 'temporary'
        })
        .expect(200)

      await request(app)
        .delete(`${basePath}/admin/post/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      const post = await prismaRaw.post.findUnique({ where: { id: created.body.id } })
      expect(post).toBeNull()
    })
  })
})
