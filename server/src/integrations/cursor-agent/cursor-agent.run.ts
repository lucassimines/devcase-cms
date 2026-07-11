import { cursorApiFetch } from './cursor-agent.client.js'
import type { CreateCursorAgentResponse, CursorAgentRun } from './cursor-agent.types.js'

const TERMINAL_RUN_STATUSES = new Set(['FINISHED', 'ERROR', 'CANCELLED', 'EXPIRED'])
const POLL_INTERVAL_MS = 3_000

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function createCursorAgent(prompt: string, modelId: string) {
  return cursorApiFetch<CreateCursorAgentResponse>('/v1/agents', {
    method: 'POST',
    body: JSON.stringify({
      prompt: { text: prompt },
      model: { id: modelId },
      mode: 'agent'
    })
  })
}

export async function startCursorRun(agentId: string, promptText: string) {
  const response = await cursorApiFetch<{ run: CursorAgentRun }>(`/v1/agents/${agentId}/runs`, {
    method: 'POST',
    body: JSON.stringify({
      prompt: { text: promptText },
      mode: 'agent'
    })
  })

  return response.run
}

export async function waitForCursorRun(
  agentId: string,
  runId: string,
  options: {
    timeoutMs: number
    timeoutEnvironmentVariable: string
  }
) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < options.timeoutMs) {
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
    `Cursor agent timed out after ${Math.round(options.timeoutMs / 1000)}s. ` +
      `Try again or increase ${options.timeoutEnvironmentVariable}.`
  )
}

export async function archiveCursorAgent(agentId: string) {
  try {
    await cursorApiFetch(`/v1/agents/${agentId}/archive`, { method: 'POST' })
  } catch {
    // Best-effort cleanup must not hide the generation result.
  }
}
