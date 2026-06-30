import type { GeneratePostOptions, GeneratedPostContent } from './post-generator.types.js'
import { buildPostInstructions, buildPostPrompt, extractJson } from './post-generator.prompt.js'
import { generatedPostSchema } from './post-generator.schema.js'

const DEFAULT_MODEL = 'gpt-4o-mini'
const DEFAULT_API_URL = 'https://api.openai.com/v1/chat/completions'

export async function generatePostWithOpenAi(
  options: GeneratePostOptions
): Promise<GeneratedPostContent> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add it to server/.env or use --provider cursor.'
    )
  }

  const model = process.env.POST_GENERATOR_MODEL || DEFAULT_MODEL
  const apiUrl = process.env.POST_GENERATOR_API_URL || DEFAULT_API_URL

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildPostInstructions() },
        { role: 'user', content: buildPostPrompt(options) }
      ]
    })
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`OpenAI request failed (${response.status}): ${errorBody}`)
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const rawContent = payload.choices?.[0]?.message?.content

  if (!rawContent) {
    throw new Error('OpenAI response did not include content.')
  }

  const parsed = JSON.parse(extractJson(rawContent))
  return generatedPostSchema.parse(parsed)
}
