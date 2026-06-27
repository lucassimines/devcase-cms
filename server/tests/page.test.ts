import type { Express } from 'express'
import request from 'supertest'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { createApp } from '@src/app.js'
import { prismaRaw } from '@src/db.js'

import { TEST_ENV } from '@tests/env'
import { prepareTestDatabase } from '@tests/helpers/database'
import { loginAsTestUser, seedTestUser } from '@tests/helpers/auth'

const basePath = TEST_ENV.API_BASE_PATH

describe('Page admin API', () => {
  let app: Express

  beforeAll(async () => {
    await prepareTestDatabase()
    app = await createApp()
    await seedTestUser()
  })

  afterEach(async () => {
    await prismaRaw.page.deleteMany()
  })

  describe('POST /admin/page', () => {
    it('creates a page with localized name and slug', async () => {
      const token = await loginAsTestUser(app)

      const res = await request(app)
        .post(`${basePath}/admin/page`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { 'en-US': 'About Us', 'pt-BR': 'Sobre nós' },
          slug: 'about-us'
        })
        .expect(200)

      expect(res.body).toMatchObject({
        name: { 'en-US': 'About Us', 'pt-BR': 'Sobre nós' },
        slug: 'about-us',
        code: 'about-us',
        published: false,
        order: 0
      })
      expect(res.body.id).toBeTruthy()
    })

    it('requires authentication', async () => {
      await request(app)
        .post(`${basePath}/admin/page`)
        .send({
          name: { 'en-US': 'Private', 'pt-BR': '' },
          slug: 'private'
        })
        .expect(400)
    })
  })

  describe('GET /admin/page/:id', () => {
    it('returns a created page by id', async () => {
      const token = await loginAsTestUser(app)

      const created = await request(app)
        .post(`${basePath}/admin/page`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { 'en-US': 'Contact', 'pt-BR': 'Contato' },
          slug: 'contact'
        })
        .expect(200)

      const res = await request(app)
        .get(`${basePath}/admin/page/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body).toMatchObject({
        id: created.body.id,
        slug: 'contact'
      })
    })
  })

  describe('DELETE /admin/page/:id', () => {
    it('deletes a page', async () => {
      const token = await loginAsTestUser(app)

      const created = await request(app)
        .post(`${basePath}/admin/page`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { 'en-US': 'Temporary', 'pt-BR': '' },
          slug: 'temporary'
        })
        .expect(200)

      await request(app)
        .delete(`${basePath}/admin/page/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      const page = await prismaRaw.page.findUnique({ where: { id: created.body.id } })
      expect(page).toBeNull()
    })
  })
})
