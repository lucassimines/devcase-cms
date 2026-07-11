import type { Express } from 'express'
import request from 'supertest'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { createApp } from '@src/app.js'
import { TEST_ENV } from '@tests/env'
import { loginAsTestUser, seedTestUser } from '@tests/helpers/auth'
import { prepareTestDatabase } from '@tests/helpers/database'
import {
  clearPostsAndCategories,
  seedPostCategory,
  seedPublishedPost
} from '@tests/helpers/post-category'

const basePath = TEST_ENV.API_BASE_PATH

describe('Post categories', () => {
  let app: Express

  beforeAll(async () => {
    await prepareTestDatabase()
    app = await createApp()
    await seedTestUser()
  })

  afterEach(async () => {
    await clearPostsAndCategories()
  })

  describe('Admin API', () => {
    it('creates a post category', async () => {
      const token = await loginAsTestUser(app)

      const res = await request(app)
        .post(`${basePath}/admin/category/post`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { 'en-US': 'Development', 'pt-BR': 'Desenvolvimento' },
          slug: 'development'
        })
        .expect(200)

      expect(res.body).toMatchObject({
        slug: 'development',
        type: 'POST',
        name: { 'en-US': 'Development', 'pt-BR': 'Desenvolvimento' }
      })
    })

    it('lists post categories ordered by position', async () => {
      const token = await loginAsTestUser(app)

      await request(app)
        .post(`${basePath}/admin/category/post`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { 'en-US': 'Second', 'pt-BR': 'Segundo' },
          slug: 'second'
        })
        .expect(200)

      await request(app)
        .post(`${basePath}/admin/category/post`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { 'en-US': 'First', 'pt-BR': 'Primeiro' },
          slug: 'first'
        })
        .expect(200)

      const res = await request(app)
        .get(`${basePath}/admin/category/post/all`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body.map((category: { slug: string }) => category.slug)).toEqual([
        'first',
        'second'
      ])
    })
  })

  describe('GET /post-categories', () => {
    it('returns post categories ordered by position', async () => {
      await seedPostCategory('design', { 'en-US': 'Design', 'pt-BR': 'Design' }, 1)
      await seedPostCategory(
        'development',
        { 'en-US': 'Development', 'pt-BR': 'Desenvolvimento' },
        0
      )

      const res = await request(app).get(`${basePath}/post-categories`).expect(200)

      expect(res.body).toHaveLength(2)
      expect(res.body.map((category: { slug: string }) => category.slug)).toEqual([
        'development',
        'design'
      ])
      expect(res.body[0]).toMatchObject({
        slug: 'development',
        name: { 'en-US': 'Development', 'pt-BR': 'Desenvolvimento' }
      })
    })

    it('returns an empty list when no categories exist', async () => {
      const res = await request(app).get(`${basePath}/post-categories`).expect(200)

      expect(res.body).toEqual([])
    })
  })

  describe('GET /posts with category filter', () => {
    it('returns only published posts in the requested category', async () => {
      const development = await seedPostCategory('development', {
        'en-US': 'Development',
        'pt-BR': 'Desenvolvimento'
      })
      const design = await seedPostCategory('design', { 'en-US': 'Design', 'pt-BR': 'Design' })

      await seedPublishedPost('dev-post', { categoryIds: [development.id], order: 0 })
      await seedPublishedPost('design-post', { categoryIds: [design.id], order: 1 })
      await seedPublishedPost('draft-post', {
        categoryIds: [development.id],
        published: false,
        order: 2
      })

      const res = await request(app)
        .get(`${basePath}/posts`)
        .query({ category: 'development' })
        .expect(200)

      expect(
        res.body.data.map((post: { name: { 'en-US': string } }) => post.name['en-US'])
      ).toEqual(['dev-post'])
      expect(res.body.data[0]).toEqual({
        id: expect.any(String),
        name: { 'en-US': 'dev-post', 'pt-BR': 'dev-post' },
        slug: 'dev-post',
        excerpt: null,
        createdAt: expect.any(String),
        categories: [
          {
            id: development.id,
            name: { 'en-US': 'Development', 'pt-BR': 'Desenvolvimento' },
            slug: 'development'
          }
        ]
      })
    })

    it('returns 404 for an unknown category slug', async () => {
      await seedPublishedPost('orphan-post')

      const res = await request(app)
        .get(`${basePath}/posts`)
        .query({ category: 'missing' })
        .expect(404)

      expect(res.body).toEqual({ message: 'Post category not found' })
    })

    it('includes posts that belong to multiple categories', async () => {
      const development = await seedPostCategory('development', {
        'en-US': 'Development',
        'pt-BR': 'Desenvolvimento'
      })
      const design = await seedPostCategory('design', { 'en-US': 'Design', 'pt-BR': 'Design' })

      await seedPublishedPost('shared-post', {
        categoryIds: [development.id, design.id]
      })

      const developmentRes = await request(app)
        .get(`${basePath}/posts`)
        .query({ category: 'development' })
        .expect(200)

      const designRes = await request(app)
        .get(`${basePath}/posts`)
        .query({ category: 'design' })
        .expect(200)

      expect(
        developmentRes.body.data.map((post: { name: { 'en-US': string } }) => post.name['en-US'])
      ).toEqual(['shared-post'])
      expect(
        designRes.body.data.map((post: { name: { 'en-US': string } }) => post.name['en-US'])
      ).toEqual(['shared-post'])
    })
  })

  describe('GET /posts pagination', () => {
    it('paginates all published posts', async () => {
      await seedPublishedPost('post-1', { order: 0 })
      await seedPublishedPost('post-2', { order: 1 })
      await seedPublishedPost('post-3', { order: 2 })

      const pageOne = await request(app)
        .get(`${basePath}/posts`)
        .query({ page: 1, limit: 2 })
        .expect(200)

      const pageTwo = await request(app)
        .get(`${basePath}/posts`)
        .query({ page: 2, limit: 2 })
        .expect(200)

      expect(
        pageOne.body.data.map((post: { name: { 'en-US': string } }) => post.name['en-US'])
      ).toEqual(['post-1', 'post-2'])
      expect(pageOne.body.meta).toMatchObject({
        page: 1,
        limit: 2,
        total: 3,
        last_page: 2
      })

      expect(
        pageTwo.body.data.map((post: { name: { 'en-US': string } }) => post.name['en-US'])
      ).toEqual(['post-3'])
      expect(pageTwo.body.meta.page).toBe(2)
    })

    it('paginates posts within a category', async () => {
      const development = await seedPostCategory('development', {
        'en-US': 'Development',
        'pt-BR': 'Desenvolvimento'
      })

      await seedPublishedPost('dev-1', { categoryIds: [development.id], order: 0 })
      await seedPublishedPost('dev-2', { categoryIds: [development.id], order: 1 })
      await seedPublishedPost('dev-3', { categoryIds: [development.id], order: 2 })
      await seedPublishedPost('other-post', { order: 3 })

      const pageOne = await request(app)
        .get(`${basePath}/posts`)
        .query({ category: 'development', page: 1, limit: 2 })
        .expect(200)

      const pageTwo = await request(app)
        .get(`${basePath}/posts`)
        .query({ category: 'development', page: 2, limit: 2 })
        .expect(200)

      expect(
        pageOne.body.data.map((post: { name: { 'en-US': string } }) => post.name['en-US'])
      ).toEqual(['dev-1', 'dev-2'])
      expect(pageOne.body.meta).toMatchObject({
        page: 1,
        limit: 2,
        total: 3,
        last_page: 2
      })

      expect(
        pageTwo.body.data.map((post: { name: { 'en-US': string } }) => post.name['en-US'])
      ).toEqual(['dev-3'])
    })
  })
})
