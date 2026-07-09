import type { CoverImageInput } from './post-generate-image.types.js'

const COVER_STYLE = `Create a blog cover illustration for a developer portfolio site.

Visual style (keep consistent across all covers):
- Modern editorial tech illustration, cinematic but clean
- Dark, sophisticated palette with subtle accent highlights (teal, amber, or soft blue)
- Abstract or metaphorical representation of the article topic — not a screenshot or UI mockup
- Strong focal point, balanced composition, generous negative space
- Soft atmospheric lighting, subtle depth, polished digital art feel
- Suitable for a professional developer blog hero image

Strict rules:
- NO text, letters, words, logos, watermarks, or UI chrome in the image
- NO people's faces in close-up
- NO stock-photo clichés (handshake, lightbulb clipart, generic office)` 

export function buildCoverImagePrompt({ title, excerpt }: CoverImageInput) {
  const excerptLine = excerpt?.trim() ? `\nArticle summary: ${excerpt.trim()}` : ''

  return `${COVER_STYLE}

Article title: ${title.trim()}${excerptLine}

Illustrate the core idea of this article as a single cohesive cover image.`
}
