import { describe, expect, it } from 'vitest'

import {
  migrateProjectBlock,
  migrateProjectBlocks,
  projectBlocksNeedMigration,
  toLocalizedString
} from '@src/utils/localized-json.utils.js'

describe('localized-json utils', () => {
  describe('toLocalizedString', () => {
    it('wraps plain strings under en-US', () => {
      expect(toLocalizedString('Website')).toEqual({
        'en-US': 'Website',
        'pt-BR': ''
      })
    })

    it('keeps existing localized objects', () => {
      const value = { 'en-US': 'Website', 'pt-BR': 'Site' }

      expect(toLocalizedString(value)).toEqual(value)
    })
  })

  describe('migrateProjectBlocks', () => {
    it('localizes text, web, and text_image blocks', () => {
      const blocks = [
        {
          type: 'text',
          content: { text: '<p>Hello</p>' }
        },
        {
          type: 'web',
          content: {
            image: {
              desktop: 'desktop.png',
              mobile: 'mobile.png'
            }
          }
        },
        {
          type: 'text_image',
          content: {
            title: 'Title',
            text: '<p>Body</p>',
            image: 'image.png',
            textPosition: 'right'
          }
        }
      ]

      expect(migrateProjectBlocks(blocks)).toEqual([
        {
          type: 'text',
          content: {
            text: { 'en-US': '<p>Hello</p>', 'pt-BR': '' }
          }
        },
        {
          type: 'web',
          content: {
            image: {
              desktop: { 'en-US': 'desktop.png', 'pt-BR': '' },
              mobile: { 'en-US': 'mobile.png', 'pt-BR': '' }
            }
          }
        },
        {
          type: 'text_image',
          content: {
            title: { 'en-US': 'Title', 'pt-BR': '' },
            text: { 'en-US': '<p>Body</p>', 'pt-BR': '' },
            image: { 'en-US': 'image.png', 'pt-BR': '' },
            textPosition: 'right'
          }
        }
      ])
    })

    it('is idempotent', () => {
      const migrated = migrateProjectBlocks([
        {
          type: 'text',
          content: { text: 'Hello' }
        }
      ])

      expect(migrateProjectBlocks(migrated)).toEqual(migrated)
      expect(projectBlocksNeedMigration(migrated)).toBe(false)
    })

    it('leaves unknown block types unchanged', () => {
      const block = { type: 'custom', content: { foo: 'bar' } }

      expect(migrateProjectBlock(block)).toEqual(block)
    })
  })
})
