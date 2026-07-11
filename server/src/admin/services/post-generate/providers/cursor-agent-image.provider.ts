import { cursorApiFetch } from '@src/integrations/cursor-agent/cursor-agent.client.js'
import {
  archiveCursorAgent,
  createCursorAgent,
  sleep,
  startCursorRun,
  waitForCursorRun
} from '@src/integrations/cursor-agent/cursor-agent.run.js'
import { extractJson } from '@src/utils/agent-json.utils.js'
import {
  buildCoverImagePrompt,
  COVER_ARTIFACT_PATH,
  COVER_ASPECT,
  COVER_HEIGHT,
  COVER_WIDTH
} from '../post-generate-image.prompt.js'
import type { CoverImageInput } from '../post-generate-image.types.js'

const DEFAULT_IMAGE_MODEL = 'composer-2.5'
const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000
const ARTIFACT_POLL_ATTEMPTS = 8
const ARTIFACT_POLL_INTERVAL_MS = 2_000
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

const API_FOLLOW_UP_PROMPT = `The cover image is missing from artifacts/.
Use the image generation tool again if needed, then COPY the generated file to ${COVER_ARTIFACT_PATH}.
Confirm the file exists under artifacts/, then respond with ONLY valid JSON: {"path":"${COVER_ARTIFACT_PATH}"}`

type ArtifactItem = {
  path: string
  sizeBytes: number
  updatedAt: string
}

type ArtifactListResponse = {
  items?: ArtifactItem[]
}

type ArtifactDownloadResponse = {
  url: string
}

function buildApiPromptSuffix() {
  return `This is an image-only CMS task with no repository or code to edit.

Steps:
1. Use the image generation tool to create ONE blog cover image (${COVER_WIDTH}×${COVER_HEIGHT}px, aspect ${COVER_ASPECT}) in the requested style.
2. The tool may save under assets/ — copy or move the generated file to ${COVER_ARTIFACT_PATH} (must be under artifacts/).
3. Confirm the file exists at ${COVER_ARTIFACT_PATH}.

When finished, respond with ONLY valid JSON: {"path":"${COVER_ARTIFACT_PATH}"}
No plan, no commentary, no markdown fences, no text outside the JSON object.`
}

function imageGeneratorTimeoutMs() {
  return Number(process.env.IMAGE_GENERATOR_TIMEOUT_MS || process.env.POST_GENERATOR_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS
}

function waitForImageRun(agentId: string, runId: string) {
  return waitForCursorRun(agentId, runId, {
    timeoutMs: imageGeneratorTimeoutMs(),
    timeoutEnvironmentVariable: 'IMAGE_GENERATOR_TIMEOUT_MS'
  })
}

function parseAgentImagePayload(result: string) {
  const cleaned = extractJson(result.trim())

  try {
    const parsed = JSON.parse(cleaned) as { path?: string; imageBase64?: string }

    if (typeof parsed.imageBase64 === 'string' && parsed.imageBase64.trim()) {
      return { type: 'base64' as const, data: parsed.imageBase64.trim() }
    }

    if (typeof parsed.path === 'string' && parsed.path.trim()) {
      return { type: 'path' as const, data: parsed.path.trim() }
    }
  } catch {
    // Fall through to artifact listing.
  }

  return undefined
}

function isImageArtifact(path: string) {
  const lower = path.toLowerCase()

  return IMAGE_EXTENSIONS.some((extension) => lower.endsWith(extension))
}

function normalizeArtifactPath(path: string) {
  const trimmed = path.trim().replace(/^\.\//, '')

  if (trimmed.startsWith('artifacts/')) {
    return trimmed
  }

  if (trimmed.startsWith('/')) {
    const artifactsIndex = trimmed.indexOf('/artifacts/')

    if (artifactsIndex >= 0) {
      return trimmed.slice(artifactsIndex + 1)
    }
  }

  return `artifacts/${trimmed.replace(/^assets\//, '')}`
}

function artifactPathCandidates(path: string) {
  const normalized = normalizeArtifactPath(path)
  const basename = normalized.split('/').pop() || normalized

  return [...new Set([normalized, `artifacts/${basename}`, path.trim()])]
}

async function listImageArtifacts(agentId: string) {
  const response = await cursorApiFetch<ArtifactListResponse>(`/v1/agents/${agentId}/artifacts`)

  return (response.items ?? [])
    .filter((item) => isImageArtifact(item.path))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
}

async function waitForImageArtifacts(agentId: string) {
  for (let attempt = 0; attempt < ARTIFACT_POLL_ATTEMPTS; attempt++) {
    const artifacts = await listImageArtifacts(agentId)

    if (artifacts.length) {
      return artifacts
    }

    if (attempt < ARTIFACT_POLL_ATTEMPTS - 1) {
      await sleep(ARTIFACT_POLL_INTERVAL_MS)
    }
  }

  return []
}

async function downloadArtifact(agentId: string, artifactPath: string) {
  const response = await cursorApiFetch<ArtifactDownloadResponse>(
    `/v1/agents/${agentId}/artifacts/download?path=${encodeURIComponent(artifactPath)}`
  )
  const imageResponse = await fetch(response.url)

  if (!imageResponse.ok) {
    throw new Error(`Failed to download generated cover image (${imageResponse.status}).`)
  }

  return Buffer.from(await imageResponse.arrayBuffer())
}

function pickPreferredArtifact(artifacts: ArtifactItem[], claimedPath?: string) {
  if (claimedPath) {
    const candidates = new Set(artifactPathCandidates(claimedPath))
    const matched = artifacts.find((item) => candidates.has(item.path))

    if (matched) return matched
  }

  return (
    artifacts.find((item) => item.path.endsWith('cover.webp')) ??
    artifacts.find((item) => item.path.endsWith('cover.png')) ??
    artifacts[0]
  )
}

async function resolveCoverImageBuffer(agentId: string, result: string) {
  const payload = parseAgentImagePayload(result)

  if (payload?.type === 'base64') {
    return Buffer.from(payload.data, 'base64')
  }

  const artifacts = await waitForImageArtifacts(agentId)
  const preferred = pickPreferredArtifact(artifacts, payload?.type === 'path' ? payload.data : undefined)

  if (preferred) {
    return downloadArtifact(agentId, preferred.path)
  }

  if (payload?.type === 'path') {
    let lastError: Error | undefined

    for (const candidate of artifactPathCandidates(payload.data)) {
      try {
        return await downloadArtifact(agentId, candidate)
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
      }
    }

    throw (
      lastError ??
      new Error(
        `Cursor agent claimed image path "${payload.data}" but no artifact was found under artifacts/.`
      )
    )
  }

  throw new Error(
    'Cursor agent did not produce a cover image under artifacts/. The image generator may have saved to assets/ without copying it.'
  )
}

async function runAgentAndFetchImage(agentId: string, runId: string) {
  let run = await waitForImageRun(agentId, runId)

  if (!run.result?.trim()) {
    throw new Error('Cursor agent finished without a result.')
  }

  try {
    return await resolveCoverImageBuffer(agentId, run.result)
  } catch (firstError) {
    const followUpRun = await startCursorRun(agentId, API_FOLLOW_UP_PROMPT)

    run = await waitForImageRun(agentId, followUpRun.id)

    if (!run.result?.trim()) {
      throw new Error('Cursor agent finished without a result on follow-up.')
    }

    try {
      return await resolveCoverImageBuffer(agentId, run.result)
    } catch (secondError) {
      const firstMessage = firstError instanceof Error ? firstError.message : String(firstError)
      const secondMessage = secondError instanceof Error ? secondError.message : String(secondError)

      throw new Error(`${secondMessage} (after retry; first attempt: ${firstMessage})`)
    }
  }
}

function resolveImageModelId() {
  return (
    process.env.POST_GENERATOR_CURSOR_MODEL?.trim() ||
    process.env.IMAGE_GENERATOR_CURSOR_MODEL?.trim() ||
    DEFAULT_IMAGE_MODEL
  )
}

export async function generateCoverImageWithCursor(input: CoverImageInput): Promise<Buffer> {
  const modelId = resolveImageModelId()
  const prompt = `${buildCoverImagePrompt(input)}\n\n${buildApiPromptSuffix()}`
  const created = await createCursorAgent(prompt, modelId)
  const agentId = created.agent.id

  try {
    return await runAgentAndFetchImage(agentId, created.run.id)
  } finally {
    await archiveCursorAgent(agentId)
  }
}
