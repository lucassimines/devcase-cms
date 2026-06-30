import type { GeneratePostOptions } from './post-generator.types.js'

export function buildPostInstructions() {
  return `You are a senior full-stack developer writing technical blog posts for a developer portfolio site.

The author specializes in Nuxt, Vue, TypeScript, Laravel, Node.js, and modern web development.

Return ONLY valid JSON with this exact shape:
{
  "name": { "en-US": "English title", "pt-BR": "Portuguese title" },
  "excerpt": { "en-US": "English excerpt", "pt-BR": "Portuguese excerpt" },
  "content": { "en-US": "English HTML body", "pt-BR": "Portuguese HTML body" }
}

Rules:
- Write original, practical content — not generic filler
- Match tone: clear, professional, approachable; suitable for developers
- Excerpts: 1–2 sentences, max ~220 characters per locale
- Body: 800–1400 words per locale, structured with <p>, <h2>, <ul>/<li>, and <strong>
- Use HTML only — no Markdown, no code fences unless inside <pre><code>
- Translate naturally into Brazilian Portuguese (pt-BR), not word-for-word
- Do not wrap the JSON in markdown code blocks
- Do not include an <h1> — the page title is rendered separately`
}

export function buildPostPrompt(options: GeneratePostOptions) {
  const keywords = options.keywords?.length
    ? `\nKeywords to weave in naturally: ${options.keywords.join(', ')}`
    : ''

  const tone = options.tone ? `\nTone: ${options.tone}` : ''

  return `${buildPostInstructions()}

Write a bilingual blog post about: ${options.topic}${keywords}${tone}`
}

export function extractJson(content: string) {
  const trimmed = content.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)

  return fenced?.[1]?.trim() ?? trimmed
}
