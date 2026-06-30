import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'

import type { GeneratePostOptions, GeneratedPostContent } from './post-generator.types.js'
import { buildPostPrompt, extractJson } from './post-generator.prompt.js'
import { generatedPostSchema } from './post-generator.schema.js'

const execFileAsync = promisify(execFile)

type CursorCli = {
  command: string
  wrapArgs: (agentArgs: string[]) => string[]
}

async function resolveCursorCli(): Promise<CursorCli> {
  const candidates: CursorCli[] = [
    { command: 'cursor', wrapArgs: (args) => ['agent', ...args] },
    { command: 'cursor-agent', wrapArgs: (args) => args },
    { command: 'agent', wrapArgs: (args) => args }
  ]

  for (const candidate of candidates) {
    try {
      await execFileAsync(candidate.command, ['--version'], { timeout: 5_000 })
      return candidate
    } catch {
      // Try the next CLI binary name.
    }
  }

  throw new Error(
    'Cursor CLI is not installed. Install it with: curl https://cursor.com/install -fsS | bash'
  )
}

export async function hasCursorCli() {
  try {
    await resolveCursorCli()
    return true
  } catch {
    return false
  }
}

const WRAPPER_KEYS = ['result', 'text', 'response', 'output', 'content'] as const

function stripAgentNoise(output: string) {
  return output
    .split('\n')
    .filter((line) => !/^cursor-retrieval:/i.test(line.trim()))
    .join('\n')
    .trim()
}

function findJsonObjectCandidates(text: string) {
  const candidates: string[] = []

  for (let start = 0; start < text.length; start++) {
    if (text[start] !== '{') continue

    let depth = 0
    let inString = false
    let escaped = false

    for (let index = start; index < text.length; index++) {
      const char = text[index]

      if (inString) {
        if (escaped) {
          escaped = false
          continue
        }

        if (char === '\\') {
          escaped = true
          continue
        }

        if (char === '"') {
          inString = false
        }

        continue
      }

      if (char === '"') {
        inString = true
        continue
      }

      if (char === '{') {
        depth++
        continue
      }

      if (char === '}') {
        depth--

        if (depth === 0) {
          candidates.push(text.slice(start, index + 1))
          break
        }
      }
    }
  }

  return candidates
}

function tryParsePostPayload(value: unknown): GeneratedPostContent | undefined {
  const parsed = generatedPostSchema.safeParse(value)

  return parsed.success ? parsed.data : undefined
}

function tryParsePostJsonString(value: string): GeneratedPostContent | undefined {
  const trimmed = value.trim()

  if (!trimmed) return undefined

  const candidates = [trimmed, extractJson(trimmed)]

  for (const candidate of candidates) {
    try {
      const post = tryParsePostPayload(JSON.parse(candidate))

      if (post) return post
    } catch {
      // Try the next candidate shape.
    }
  }

  return undefined
}

function isStatusOnlyOutput(text: string) {
  const cleaned = text.trim()

  if (!cleaned) return true
  if (cleaned.includes('{')) return false

  return /^(checking|cursor-retrieval:|authenticat)/i.test(cleaned)
}

function extractPostFromWrapper(record: Record<string, unknown>) {
  for (const key of WRAPPER_KEYS) {
    const value = record[key]

    if (typeof value === 'string' && value.trim()) {
      const post = tryParsePostJsonString(value)

      if (post) return post
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

    if (text.trim()) {
      return tryParsePostJsonString(text)
    }
  }

  return tryParsePostPayload(record)
}

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
      for (const key of WRAPPER_KEYS) {
        const value = (parsed as Record<string, unknown>)[key]

        if (typeof value === 'string' && value.trim()) {
          return value
        }
      }

      const messages = (parsed as Record<string, unknown>).messages

      if (Array.isArray(messages)) {
        const text = messages
          .flatMap((message: unknown) => {
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

export function parseGeneratedPostFromAgentStdout(stdout: string): GeneratedPostContent {
  const cleaned = stripAgentNoise(stdout)

  if (!cleaned) {
    throw new Error('Cursor agent returned an empty response.')
  }

  for (const line of cleaned.split('\n')) {
    const trimmedLine = line.trim()

    if (!trimmedLine.startsWith('{')) continue

    try {
      const event = JSON.parse(trimmedLine) as unknown

      if (event && typeof event === 'object') {
        const post = extractPostFromWrapper(event as Record<string, unknown>)

        if (post) return post
      }
    } catch {
      // Try the next stream event.
    }
  }

  try {
    const wrapper = JSON.parse(cleaned) as unknown

    if (wrapper && typeof wrapper === 'object') {
      const post = extractPostFromWrapper(wrapper as Record<string, unknown>)

      if (post) return post
    }

    if (typeof wrapper === 'string') {
      const post = tryParsePostJsonString(wrapper)

      if (post) return post
    }
  } catch {
    // Fall through to candidate scanning.
  }

  const fenced = extractJson(cleaned)

  if (fenced !== cleaned) {
    const post = tryParsePostJsonString(fenced)

    if (post) return post
  }

  const candidates = findJsonObjectCandidates(cleaned)

  for (let index = candidates.length - 1; index >= 0; index--) {
    const candidate = candidates[index]!

    try {
      const parsed = JSON.parse(candidate) as unknown

      if (parsed && typeof parsed === 'object') {
        const post = extractPostFromWrapper(parsed as Record<string, unknown>)

        if (post) return post
      }

      if (typeof parsed === 'string') {
        const post = tryParsePostJsonString(parsed)

        if (post) return post
      }
    } catch {
      // Try the next candidate object.
    }
  }

  const postFromWrapperText = tryParsePostJsonString(parseAgentOutput(cleaned))

  if (postFromWrapperText) return postFromWrapperText

  if (isStatusOnlyOutput(cleaned)) {
    throw new Error(
      'Cursor agent returned only a status message and no post content. Run `cursor agent login` or set CURSOR_API_KEY in server/.env, then retry.'
    )
  }

  const preview = cleaned.slice(0, 240).replace(/\s+/g, ' ')

  throw new Error(
    `Cursor agent did not return valid post JSON. Preview: ${preview}${cleaned.length > 240 ? '…' : ''}`
  )
}

async function ensureCursorAuth() {
  if (process.env.CURSOR_API_KEY?.trim()) {
    return
  }

  try {
    const cli = await resolveCursorCli()
    const { stdout } = await execFileAsync(cli.command, cli.wrapArgs(['status']), {
      timeout: 15_000
    })

    if (/not logged in/i.test(stdout)) {
      throw new Error('not logged in')
    }
  } catch {
    throw new Error(
      'Cursor is not authenticated. Set CURSOR_API_KEY in server/.env, or run `cursor agent login` once.'
    )
  }
}

function buildAgentArgs(prompt: string) {
  const workspace = process.env.POST_GENERATOR_WORKSPACE || process.cwd()
  const outputFormat = process.env.POST_GENERATOR_CURSOR_OUTPUT_FORMAT?.trim() || 'text'
  const args = [
    '--print',
    '--output-format',
    outputFormat,
    '--mode',
    'ask',
    '--trust',
    '--workspace',
    workspace
  ]

  const apiKey = process.env.CURSOR_API_KEY?.trim()

  if (apiKey) {
    args.push('--api-key', apiKey)
  }

  const model = process.env.POST_GENERATOR_CURSOR_MODEL?.trim()

  if (model) {
    args.push('--model', model)
  }

  args.push(prompt)

  return args
}

async function runCursorAgent(prompt: string) {
  const cli = await resolveCursorCli()
  const args = cli.wrapArgs(buildAgentArgs(prompt))

  return new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve, reject) => {
    const child = spawn(cli.command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('error', reject)

    child.on('close', (exitCode) => {
      resolve({
        stdout,
        stderr,
        exitCode: exitCode ?? 1
      })
    })
  })
}

export async function generatePostWithCursorCli(
  options: GeneratePostOptions
): Promise<GeneratedPostContent> {
  await ensureCursorAuth()

  const prompt = buildPostPrompt(options)
  const { stdout, stderr, exitCode } = await runCursorAgent(prompt)

  if (stderr.trim()) {
    console.error(stderr.trim())
  }

  if (exitCode !== 0) {
    const details = [stderr.trim(), stdout.trim()].filter(Boolean).join('\n')
    throw new Error(`Cursor agent failed (exit ${exitCode}).\n${details}`)
  }

  return parseGeneratedPostFromAgentStdout(stdout)
}
