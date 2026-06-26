import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { localeCodes } from '~/types/locale'
import {
  emptyLocalizedString,
  localizedStringSchema,
  makeLocalizedPath,
  resolveLocalizedText
} from '~/utils/locale'

describe('locale utilities', () => {
  describe('emptyLocalizedString', () => {
    it('creates empty values for every supported locale', () => {
      expect(emptyLocalizedString()).toEqual({
        'en-US': '',
        'pt-BR': ''
      })
    })
  })

  describe('makeLocalizedPath', () => {
    it('builds nested validation paths for localized fields', () => {
      expect(makeLocalizedPath('name', 'en-US')).toBe('name.en-US')
      expect(makeLocalizedPath('intro.title', 'pt-BR')).toBe('intro.title.pt-BR')
    })
  })

  describe('resolveLocalizedText', () => {
    it('returns plain strings unchanged', () => {
      expect(resolveLocalizedText('Home', 'en-US')).toBe('Home')
    })

    it('returns the requested locale when present', () => {
      expect(
        resolveLocalizedText(
          {
            'en-US': 'Home',
            'pt-BR': 'Início'
          },
          'pt-BR'
        )
      ).toBe('Início')
    })

    it('falls back to the default locale when the requested locale is empty', () => {
      expect(
        resolveLocalizedText(
          {
            'en-US': 'Home',
            'pt-BR': ''
          },
          'pt-BR'
        )
      ).toBe('Home')
    })

    it('returns an empty string for nullish values', () => {
      expect(resolveLocalizedText(null, 'en-US')).toBe('')
      expect(resolveLocalizedText(undefined, 'en-US')).toBe('')
    })
  })

  describe('localizedStringSchema', () => {
    it('accepts a valid localized object', () => {
      const result = localizedStringSchema().safeParse({
        'en-US': 'Home',
        'pt-BR': 'Início'
      })

      expect(result.success).toBe(true)
    })

    it('allows an empty default locale', () => {
      const result = localizedStringSchema().safeParse({
        'en-US': '',
        'pt-BR': 'Início'
      })

      expect(result.success).toBe(true)
    })

    it('allows an empty optional locale', () => {
      const result = localizedStringSchema().safeParse({
        'en-US': 'Home',
        'pt-BR': ''
      })

      expect(result.success).toBe(true)
    })

    it('defaults missing locale keys to empty strings', () => {
      const result = localizedStringSchema().safeParse({})

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes('en-US'))).toBe(true)
      }

      const defaulted = localizedStringSchema().parse(undefined)

      expect(defaulted).toEqual(Object.fromEntries(localeCodes.map((code) => [code, ''])))
    })

    it('requires the default locale to be non-empty when a min-length schema is provided', () => {
      const result = localizedStringSchema(z.string().min(1)).safeParse({
        'en-US': '',
        'pt-BR': 'Início'
      })

      expect(result.success).toBe(false)
    })

    it('accepts a custom zod string schema', () => {
      const result = localizedStringSchema(z.string().min(3)).safeParse({
        'en-US': 'Hi',
        'pt-BR': ''
      })

      expect(result.success).toBe(false)
    })

    it('accepts a url or empty string for the default locale', () => {
      const schema = localizedStringSchema(z.union([z.url(), z.literal('')]))

      expect(schema.safeParse({ 'en-US': 'https://example.com', 'pt-BR': '' }).success).toBe(true)
      expect(schema.safeParse({ 'en-US': '', 'pt-BR': '' }).success).toBe(true)
      expect(schema.safeParse({ 'en-US': 'not-a-url', 'pt-BR': '' }).success).toBe(false)
    })
  })
})
