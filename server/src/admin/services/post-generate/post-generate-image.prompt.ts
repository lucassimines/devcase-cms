import type { CoverImageInput } from './post-generate-image.types.js'

export const COVER_WIDTH = 1200
export const COVER_HEIGHT = 720
export const COVER_ASPECT = '5:3'
export const COVER_ARTIFACT_PATH = 'artifacts/cover.webp'
export const BRAND_COLOR = '#0055ff'

const COVER_STYLE = `Create a blog cover image for a developer portfolio blog.

Visual style (keep identical across every cover):
- 2D pixel art / retro pixel illustration — crisp pixels, limited palette, no photorealism
- Brand accent color: ${BRAND_COLOR} — use it for highlights, glows, UI accents, or key focal elements
- Dark background (near-black or deep navy) so ${BRAND_COLOR} pops; optional subtle grid or scanline texture
- Metaphorical scene inspired by the article topic — code, architecture, APIs, dev workflows, abstract tech symbols
- Clean composition with one clear focal point; readable at card and hero sizes
- Mood: professional, modern, slightly playful — indie dev / craft software aesthetic

Technical output:
- Aspect ratio ${COVER_ASPECT} (${COVER_WIDTH}×${COVER_HEIGHT}px)
- Prefer WebP (PNG is fine — CMS converts to WebP)
- Save under artifacts/ (e.g. ${COVER_ARTIFACT_PATH}) — not only assets/

Strict rules:
- NO text, letters, words, URLs, logos, watermarks, or readable UI labels in the image
- NO photorealistic rendering, 3D, or soft gradients that break the pixel look
- NO stock-photo clichés (handshake, generic office, lightbulb clipart)
- NO close-up human faces`

export function buildCoverImagePrompt({ title, excerpt }: CoverImageInput) {
  const excerptLine = excerpt?.trim() ? `\nArticle summary: ${excerpt.trim()}` : ''

  return `${COVER_STYLE}

Article title: ${title.trim()}${excerptLine}

Illustrate the core idea of this article as a single cohesive pixel-art cover.`
}
