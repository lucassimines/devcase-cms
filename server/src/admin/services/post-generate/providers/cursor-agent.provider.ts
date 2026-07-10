import type { GeneratePostOptions, GeneratedPostContent } from '../post-generate.types.js'
import { buildPostPrompt } from '../post-generate.prompt.js'
import { parseGeneratedPostFromAgentStdout } from './cursor-agent.parse.js'

const CURSOR_API_BASE = process.env.CURSOR_API_URL?.trim() || 'https://api.cursor.com'
const TERMINAL_RUN_STATUSES = new Set(['FINISHED', 'ERROR', 'CANCELLED', 'EXPIRED'])
const POLL_INTERVAL_MS = 3_000
const API_PROMPT_SUFFIX = `This is a text-only CMS task with no repository or files.
Do not create a plan, status update, or research summary.
Write the full bilingual post and respond in one message with ONLY the JSON object from the schema above.
No preamble, no markdown fences, no text before or after the JSON.`

const API_FOLLOW_UP_PROMPT = `Output ONLY the final JSON object for the bilingual blog post from my first message.
Match the exact schema (name, excerpt, content with en-US and pt-BR).
No plan, no commentary, no markdown fences, no text outside the JSON object.`

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
      'CURSOR_API_KEY is not set. Add it to server env vars for post generation.'
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
      'Enable cloud agent storage in Cursor settings.'
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

function tryParseGeneratedPost(text: string) {
  try {
    return parseGeneratedPostFromAgentStdout(text)
  } catch {
    return undefined
  }
}

function shouldRequestJsonFollowUp(text: string) {
  const cleaned = text.trim()

  if (!cleaned) return true

  if (tryParseGeneratedPost(cleaned)) {
    return false
  }

  return !cleaned.includes('{')
}

async function startCursorRun(agentId: string, promptText: string) {
  const response = await cursorApiFetch<{ run: CursorAgentRun }>(`/v1/agents/${agentId}/runs`, {
    method: 'POST',
    body: JSON.stringify({
      prompt: { text: promptText },
      mode: 'agent'
    })
  })

  return response.run
}

async function runAgentAndParsePost(agentId: string, runId: string) {
  let run = await waitForCursorRun(agentId, runId)

  if (!run.result?.trim()) {
    throw new Error('Cursor agent finished without a result.')
  }

  const parsed = tryParseGeneratedPost(run.result)

  if (parsed) {
    return parsed
  }

  if (!shouldRequestJsonFollowUp(run.result)) {
    return parseGeneratedPostFromAgentStdout(run.result)
  }

  const followUpRun = await startCursorRun(agentId, API_FOLLOW_UP_PROMPT)

  run = await waitForCursorRun(agentId, followUpRun.id)

  if (!run.result?.trim()) {
    throw new Error('Cursor agent finished without a result on follow-up.')
  }

  return parseGeneratedPostFromAgentStdout(run.result)
}

export async function generatePostWithCursorApi(
  options: GeneratePostOptions
): Promise<GeneratedPostContent> {
  const modelId = process.env.POST_GENERATOR_CURSOR_MODEL?.trim() || 'composer-2.5'
  const prompt = `${buildPostPrompt(options)}\n\n${API_PROMPT_SUFFIX}`

  const created = await cursorApiFetch<CreateAgentResponse>('/v1/agents', {
    method: 'POST',
    body: JSON.stringify({
      prompt: { text: prompt },
      model: { id: modelId },
      mode: 'agent'
    })
  })

  const agentId = created.agent.id
  const runId = created.run.id

  try {
    return await runAgentAndParsePost(agentId, runId)
  } finally {
    await archiveCursorAgent(agentId)
  }
}
