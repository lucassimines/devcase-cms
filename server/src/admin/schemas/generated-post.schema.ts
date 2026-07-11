import { z } from 'zod'

const localizedField = z.object({
  'en-US': z.string().min(1),
  'pt-BR': z.string().min(1)
})

export const generatedPostSchema = z.object({
  name: localizedField,
  excerpt: localizedField,
  content: localizedField
})

export type GeneratedPostPayload = z.infer<typeof generatedPostSchema>
