import { z } from 'zod'

export const postGenerateImageSchema = z.object({
  style: z.string().trim().min(1).max(200).optional()
})

export type PostGenerateImageInput = z.infer<typeof postGenerateImageSchema>
