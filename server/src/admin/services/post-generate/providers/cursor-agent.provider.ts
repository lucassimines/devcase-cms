import {
  archiveCursorAgent,
  createCursorAgent,
  startCursorRun,
  waitForCursorRun
} from '@src/integrations/cursor-agent/cursor-agent.run.js'
import type { GeneratePostOptions, GeneratedPostContent } from '../post-generate.types.js'
import { buildPostPrompt } from '../post-generate.prompt.js'
import { parseGeneratedPostFromAgentStdout } from './cursor-agent.parse.js'

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000
const TIMEOUT_ENVIRONMENT_VARIABLE = 'POST_GENERATOR_TIMEOUT_MS'
const API_PROMPT_SUFFIX = `This is a text-only CMS task with no repository or files.
Do not create a plan, status update, or research summary.
Write the full bilingual post and respond in one message with ONLY the JSON object from the schema above.
No preamble, no markdown fences, no text before or after the JSON.`

const API_FOLLOW_UP_PROMPT = `Output ONLY the final JSON object for the bilingual blog post from my first message.
Match the exact schema (name, excerpt, content with en-US and pt-BR).
No plan, no commentary, no markdown fences, no text outside the JSON object.`

function waitForPostRun(agentId: string, runId: string) {
  return waitForCursorRun(agentId, runId, {
    timeoutMs: Number(process.env.POST_GENERATOR_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
    timeoutEnvironmentVariable: TIMEOUT_ENVIRONMENT_VARIABLE
  })
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

async function runAgentAndParsePost(agentId: string, runId: string) {
  let run = await waitForPostRun(agentId, runId)

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

  run = await waitForPostRun(agentId, followUpRun.id)

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

  const created = await createCursorAgent(prompt, modelId)

  const agentId = created.agent.id
  const runId = created.run.id

  try {
    return await runAgentAndParsePost(agentId, runId)
  } finally {
    await archiveCursorAgent(agentId)
  }
}
