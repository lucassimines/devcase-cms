import { describe, expect, it } from 'vitest'

import { generatedPostSchema } from '@src/admin/schemas/generated-post.schema.js'
import { postGenerateImageSchema } from '@src/admin/schemas/post-generate-image.schema.js'
import {
  buildCoverImagePrompt,
  DEFAULT_IMAGE_STYLE
} from '@src/admin/services/post-generate/post-generate-image.prompt.js'
import { resolvePostSlug } from '@src/admin/services/post-generate/post-generate.store.js'
import {
  parseAgentOutput,
  parseGeneratedPostFromAgentStdout
} from '@src/admin/services/post-generate/providers/cursor-agent.parse.js'
import { extractJson } from '@src/utils/agent-json.utils.js'

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
    expect(() =>
      parseGeneratedPostFromAgentStdout('Checking eligibility for workspace access')
    ).toThrow(/status or planning message/)
  })
})

describe('extractJson', () => {
  it('unwraps fenced json blocks', () => {
    expect(extractJson('```json\n{"name":{"en-US":"Hi"}}\n```')).toBe('{"name":{"en-US":"Hi"}}')
  })
})

describe('cover image prompt', () => {
  it('includes the requested image style', () => {
    const prompt = buildCoverImagePrompt({
      title: 'Type-safe APIs',
      style: 'isometric clay illustration'
    })

    expect(prompt).toContain('Image style: isometric clay illustration')
  })

  it('uses the default style when none is provided', () => {
    const prompt = buildCoverImagePrompt({ title: 'Type-safe APIs' })

    expect(prompt).toContain(`Image style: ${DEFAULT_IMAGE_STYLE}`)
  })

  it('validates and trims image styles from the request', () => {
    expect(postGenerateImageSchema.parse({ style: '  watercolor  ' })).toEqual({
      style: 'watercolor'
    })
  })
})
