import { buildCoverImagePrompt } from './post-generate-image.prompt.js'
import type { CoverImageInput } from './post-generate-image.types.js'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const DEFAULT_MODEL = 'gemini-3.1-flash-image'
const DEFAULT_ASPECT_RATIO = '3:2'
const DEFAULT_IMAGE_SIZE = '1K'

type GeminiInteractionResponse = {
  output_image?: {
    data?: string
    mime_type?: string
  }
  error?: {
    message?: string
  }
}

function geminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it to server env vars for cover image generation.')
  }

  return {
    apiKey,
    model: process.env.IMAGE_GENERATOR_MODEL?.trim() || DEFAULT_MODEL,
    aspectRatio: process.env.IMAGE_GENERATOR_ASPECT_RATIO?.trim() || DEFAULT_ASPECT_RATIO,
    imageSize: process.env.IMAGE_GENERATOR_IMAGE_SIZE?.trim() || DEFAULT_IMAGE_SIZE
  }
}

export async function generateCoverImageWithGemini(input: CoverImageInput): Promise<Buffer> {
  const { apiKey, model, aspectRatio, imageSize } = geminiConfig()
  const prompt = buildCoverImagePrompt(input)

  const response = await fetch(`${GEMINI_API_BASE}/interactions`, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: [{ type: 'text', text: prompt }],
      response_format: {
        type: 'image',
        aspect_ratio: aspectRatio,
        image_size: imageSize
      }
    })
  })

  const body = (await response.json()) as GeminiInteractionResponse

  if (!response.ok) {
    const message = body.error?.message || JSON.stringify(body)
    throw new Error(`Gemini image generation failed (${response.status}): ${message}`)
  }

  const imageData = body.output_image?.data

  if (!imageData) {
    throw new Error('Gemini image generation returned no image data.')
  }

  return Buffer.from(imageData, 'base64')
}
