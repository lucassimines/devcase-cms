import type { GeneratedPostContent } from '../post-generate.types.js'
import { extractJson } from '../post-generate.prompt.js'
import { generatedPostSchema } from '../post-generate.schema.js'

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

  return /^(checking|cursor-retrieval:|authenticat)/i.test(cleaned) || /content plan|creating a plan/i.test(cleaned)
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
      'Cursor agent returned a status or planning message instead of post JSON. Retry generation from the admin.'
    )
  }

  const preview = cleaned.slice(0, 240).replace(/\s+/g, ' ')

  throw new Error(
    `Cursor agent did not return valid post JSON. Preview: ${preview}${cleaned.length > 240 ? '…' : ''}`
  )
}
