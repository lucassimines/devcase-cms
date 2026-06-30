import { describe, expect, it } from 'vitest'

import { parseAgentOutput, parseGeneratedPostFromAgentStdout, hasCursorCli } from '@src/lib/post-generator/post-generator.cursor.js'
import { extractJson } from '@src/lib/post-generator/post-generator.prompt.js'
import { generatedPostSchema } from '@src/lib/post-generator/post-generator.schema.js'
import { resolvePostSlug } from '@src/lib/post-generator/post-generator.store.js'
import { resolveProvider } from '@src/lib/post-generator/post-generator.js'

const samplePost = {
  name: {
    'en-US': 'Why TypeScript Matters',
    'pt-BR': 'Por que TypeScript Importa'
  },
  excerpt: {
    'en-US': 'TypeScript helps catch bugs early.',
    'pt-BR': 'TypeScript ajuda a encontrar bugs cedo.'
  },
  content: {
    'en-US': '<p>English body</p>',
    'pt-BR': '<p>Corpo em português</p>'
  }
}

describe('generatedPostSchema', () => {
  it('accepts bilingual post payloads', () => {
    expect(generatedPostSchema.parse(samplePost)).toEqual(samplePost)
  })

  it('rejects missing locales', () => {
    expect(() =>
      generatedPostSchema.parse({
        ...samplePost,
        name: { 'en-US': 'Only English' }
      })
    ).toThrow()
  })
})

describe('resolvePostSlug', () => {
  it('slugifies the English title by default', () => {
    expect(resolvePostSlug(samplePost)).toBe('why-typescript-matters')
  })

  it('uses an explicit slug when provided', () => {
    expect(resolvePostSlug(samplePost, 'custom-slug')).toBe('custom-slug')
  })
})

describe('resolveProvider', () => {
  it('defaults to cursor', () => {
    expect(resolveProvider()).toBe('cursor')
  })

  it('accepts explicit provider', () => {
    expect(resolveProvider('openai')).toBe('openai')
    expect(resolveProvider('cursor')).toBe('cursor')
  })
})

describe('hasCursorCli', () => {
  it('returns a boolean', async () => {
    expect(typeof (await hasCursorCli())).toBe('boolean')
  })
})

describe('parseAgentOutput', () => {
  it('reads plain JSON text from agent stdout', () => {
    expect(parseAgentOutput('{"result":"{\\"name\\":{\\"en-US\\":\\"Hi\\"}}"}')).toContain('name')
  })

  it('extracts result field from json wrapper', () => {
    expect(parseAgentOutput(JSON.stringify({ result: '{"name":{"en-US":"Hi"}}' }))).toBe(
      '{"name":{"en-US":"Hi"}}'
    )
  })
})

describe('parseGeneratedPostFromAgentStdout', () => {
  it('ignores cursor status text before post json', () => {
    const stdout = `Checking eligibility for workspace access...

${JSON.stringify(samplePost)}`

    expect(parseGeneratedPostFromAgentStdout(stdout)).toEqual(samplePost)
  })

  it('extracts post json from a fenced block after status text', () => {
    const stdout = `Checking eligibility...

\`\`\`json
${JSON.stringify(samplePost)}
\`\`\``

    expect(parseGeneratedPostFromAgentStdout(stdout)).toEqual(samplePost)
  })

  it('extracts post json from a result wrapper', () => {
    const stdout = JSON.stringify({
      result: JSON.stringify(samplePost)
    })

    expect(parseGeneratedPostFromAgentStdout(stdout)).toEqual(samplePost)
  })

  it('does not throw when stdout contains only cursor status text', () => {
    expect(() => parseGeneratedPostFromAgentStdout('Checking eligibility for workspace access')).toThrow(
      /status message/
    )
  })
})

describe('extractJson', () => {
  it('unwraps fenced json blocks', () => {
    expect(extractJson('```json\n{"name":{"en-US":"Hi"}}\n```')).toBe('{"name":{"en-US":"Hi"}}')
  })
})
