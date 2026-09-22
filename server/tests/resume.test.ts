import { createApp } from '@src/app.js'
import { prismaRaw } from '@src/db.js'
import { TEST_ENV } from '@tests/env'
import { loginAsTestUser, seedTestUser } from '@tests/helpers/auth'
import { prepareTestDatabase } from '@tests/helpers/database'
import type { Express } from 'express'
import request from 'supertest'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

const basePath = TEST_ENV.API_BASE_PATH

describe('Resume', () => {
  let app: Express

  beforeAll(async () => {
    await prepareTestDatabase()
    app = await createApp()
    await seedTestUser()
  })

  afterEach(async () => {
    await prismaRaw.resume.deleteMany()
  })

  describe('GET /resume', () => {
    it('returns both language keys without auth when empty', async () => {
      const res = await request(app).get(`${basePath}/resume`).expect(200)

      expect(res.body).toEqual({
        'en-US': '',
        'pt-BR': ''
      })
    })
  })

  describe('PUT /admin/resume', () => {
    it('requires authentication', async () => {
      await request(app)
        .put(`${basePath}/admin/resume`)
        .send({
          content: { 'en-US': '# Hello', 'pt-BR': '' }
        })
        .expect(400)
    })

    it('saves markdown and exposes it on the public JSON immediately', async () => {
      const token = await loginAsTestUser(app)

      const saved = await request(app)
        .put(`${basePath}/admin/resume`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: {
            'en-US': '# Lucas\n\nSoftware Engineer',
            'pt-BR': ''
          }
        })
        .expect(200)

      expect(saved.body.content).toEqual({
        'en-US': '# Lucas\n\nSoftware Engineer',
        'pt-BR': ''
      })

      const pub = await request(app).get(`${basePath}/resume`).expect(200)

      expect(pub.body).toEqual({
        'en-US': '# Lucas\n\nSoftware Engineer',
        'pt-BR': ''
      })
    })

    it('updates one locale without clobbering the other', async () => {
      const token = await loginAsTestUser(app)

      await request(app)
        .put(`${basePath}/admin/resume`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: {
            'en-US': 'English body',
            'pt-BR': 'Corpo em português'
          }
        })
        .expect(200)

      await request(app)
        .put(`${basePath}/admin/resume`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: {
            'en-US': 'English body',
            'pt-BR': 'Texto atualizado'
          }
        })
        .expect(200)

      const pub = await request(app).get(`${basePath}/resume`).expect(200)

      expect(pub.body).toEqual({
        'en-US': 'English body',
        'pt-BR': 'Texto atualizado'
      })
    })
  })

  describe('GET /admin/resume', () => {
    it('returns the saved document', async () => {
      const token = await loginAsTestUser(app)

      await request(app)
        .put(`${basePath}/admin/resume`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: { 'en-US': 'Saved', 'pt-BR': 'Salvo' }
        })
        .expect(200)

      const res = await request(app)
        .get(`${basePath}/admin/resume`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body.content).toEqual({
        'en-US': 'Saved',
        'pt-BR': 'Salvo'
      })
      expect(res.body.id).toBeTruthy()
    })
  })
})
