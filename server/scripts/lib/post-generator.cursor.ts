import { execFile } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import type { GeneratePostOptions, GeneratedPostContent } from './post-generator.types.js'
import { buildPostPrompt, extractJson } from './post-generator.prompt.js'
import { generatedPostSchema } from './post-generator.schema.js'

const execFileAsync = promisify(execFile)
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

export function parseAgentOutput(stdout: string) {
  const trimmed = stdout.trim()

  if (!trimmed) {
    throw new Error('Cursor agent returned an empty response.')
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown

    if (typeof parsed === 'string') {
      return parsed
    }

    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>

      for (const key of ['result', 'text', 'response', 'output']) {
        const value = record[key]

        if (typeof value === 'string' && value.trim()) {
          return value
        }
      }

      if (Array.isArray(record.messages)) {
        const text = record.messages
          .flatMap((message) => {
            if (!message || typeof message !== 'object') return []

            const content = (message as Record<string, unknown>).content

            if (typeof content === 'string') return [content]

            if (Array.isArray(content)) {
              return content
                .map((block) =>
                  block && typeof block === 'object' && typeof (block as Record<string, unknown>).text === 'string'
                    ? ((block as Record<string, unknown>).text as string)
                    : ''
                )
                .filter(Boolean)
            }

            return []
          })
          .join('\n')

        if (text.trim()) return text
      }
    }
  } catch {
    // Fall through to raw stdout parsing below.
  }

  return trimmed
}

async function ensureCursorAuth() {
  try {
    await execFileAsync('cursor', ['agent', 'status'], { timeout: 15_000 })
  } catch {
    throw new Error(
      'Cursor is not authenticated. Run `cursor agent login` once, then retry.'
    )
  }
}

function buildCursorArgs(prompt: string) {
  const workspace = process.env.POST_GENERATOR_WORKSPACE || repoRoot
  const args = [
    'agent',
    '--print',
    '--output-format',
    'json',
    '--mode',
    'ask',
    '--trust',
    '--workspace',
    workspace,
    prompt
  ]

  const model = process.env.POST_GENERATOR_CURSOR_MODEL?.trim()

  if (model) {
    args.splice(args.length - 1, 0, '--model', model)
  }

  return args
}

export async function generatePostWithCursor(
  options: GeneratePostOptions
): Promise<GeneratedPostContent> {
  await ensureCursorAuth()

  const prompt = buildPostPrompt(options)
  const args = buildCursorArgs(prompt)

  let stdout = ''
  let stderr = ''

  try {
    const result = await execFileAsync('cursor', args, {
      maxBuffer: 10 * 1024 * 1024,
      timeout: 10 * 60 * 1000
    })

    stdout = result.stdout
    stderr = result.stderr
  } catch (error) {
    const execError = error as NodeJS.ErrnoException & {
      stdout?: string
      stderr?: string
    }

    stdout = execError.stdout ?? ''
    stderr = execError.stderr ?? ''

    if (!stdout.trim()) {
      const details = [execError.message, stderr.trim()].filter(Boolean).join('\n')
      throw new Error(`Cursor agent failed.\n${details}`)
    }
  }

  if (stderr.trim()) {
    console.error(stderr.trim())
  }

  const rawContent = parseAgentOutput(stdout)
  const parsed = JSON.parse(extractJson(rawContent))

  return generatedPostSchema.parse(parsed)
}
