import { z } from 'zod'

export const postGenerateSchema = z.object({
  topic: z.string().trim().min(1, 'Topic is required.')
})

export type PostGenerateInput = z.infer<typeof postGenerateSchema>
