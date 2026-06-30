import type { GeneratePostOptions, GeneratedPostContent } from './post-generator.types.js'
import { buildPostPrompt } from './post-generator.prompt.js'
import { parseGeneratedPostFromAgentStdout } from './post-generator.cursor.js'

const CURSOR_API_BASE = process.env.CURSOR_API_URL?.trim() || 'https://api.cursor.com'
const TERMINAL_RUN_STATUSES = new Set(['FINISHED', 'ERROR', 'CANCELLED', 'EXPIRED'])
const POLL_INTERVAL_MS = 3_000

type CursorAgentRun = {
  id: string
  agentId: string
  status: string
  result?: string
}

type CreateAgentResponse = {
  agent: { id: string }
  run: CursorAgentRun
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function cursorAuthHeaders() {
  const apiKey = process.env.CURSOR_API_KEY?.trim()

  if (!apiKey) {
    throw new Error(
      'CURSOR_API_KEY is not set. Add it to Railway env vars for server-side post generation.'
    )
  }

  return {
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    'Content-Type': 'application/json'
  }
}

function formatCursorApiError(status: number, body: string) {
  if (/feature_unavailable|storage mode is disabled/i.test(body)) {
    return (
      'Cursor Cloud Agents are unavailable for this account (storage/privacy mode). ' +
      'Enable cloud agent storage in Cursor settings, or generate posts locally with `make generate-post`.'
    )
  }

  return `Cursor API failed (${status}): ${body}`
}

async function cursorApiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${CURSOR_API_BASE}${path}`, {
    ...init,
    headers: {
      ...cursorAuthHeaders(),
      ...init.headers
    }
  })

  const body = await response.text()

  if (!response.ok) {
    throw new Error(formatCursorApiError(response.status, body))
  }

  return JSON.parse(body) as T
}

async function archiveCursorAgent(agentId: string) {
  try {
    await cursorApiFetch(`/v1/agents/${agentId}/archive`, { method: 'POST' })
  } catch {
    // Best-effort cleanup — generation already succeeded.
  }
}

async function waitForCursorRun(agentId: string, runId: string) {
  const timeoutMs = Number(process.env.POST_GENERATOR_TIMEOUT_MS) || 15 * 60 * 1000
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    const run = await cursorApiFetch<CursorAgentRun>(`/v1/agents/${agentId}/runs/${runId}`)

    if (run.status === 'FINISHED') {
      return run
    }

    if (TERMINAL_RUN_STATUSES.has(run.status)) {
      throw new Error(`Cursor agent run ended with status ${run.status}.`)
    }

    await sleep(POLL_INTERVAL_MS)
  }

  throw new Error(
    `Cursor agent timed out after ${Math.round(timeoutMs / 1000)}s. Try again or increase POST_GENERATOR_TIMEOUT_MS.`
  )
}

export async function generatePostWithCursorApi(
  options: GeneratePostOptions
): Promise<GeneratedPostContent> {
  const modelId = process.env.POST_GENERATOR_CURSOR_MODEL?.trim() || 'composer-2.5'
  const prompt = buildPostPrompt(options)

  const created = await cursorApiFetch<CreateAgentResponse>('/v1/agents', {
    method: 'POST',
    body: JSON.stringify({
      prompt: { text: prompt },
      model: { id: modelId },
      mode: 'plan'
    })
  })

  const agentId = created.agent.id
  const runId = created.run.id

  try {
    const run = await waitForCursorRun(agentId, runId)

    if (!run.result?.trim()) {
      throw new Error('Cursor agent finished without a result.')
    }

    return parseGeneratedPostFromAgentStdout(run.result)
  } finally {
    await archiveCursorAgent(agentId)
  }
}
