import { HttpError } from '@src/errors/http.error.js'

export function throwGenerationHttpError(error: unknown, fallbackMessage: string): never {
  if (error instanceof HttpError) {
    throw error
  }

  throw new HttpError(502, error instanceof Error ? error.message : fallbackMessage)
}
