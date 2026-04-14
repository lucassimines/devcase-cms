import type { infer as Infer, ZodObject, ZodType } from 'zod'

/** True when `schema` is a Zod object (e.g. `z.object`) and `key` is in its `.shape`. */
export function hasZodSchemaProp<S extends ZodObject, K extends PropertyKey>(
  schema: S,
  key: K
): key is K & keyof Infer<S>

export function hasZodSchemaProp(schema: ZodType, key: PropertyKey): boolean

export function hasZodSchemaProp(schema: ZodType, key: PropertyKey): boolean {
  const shape = (schema as { shape?: Record<PropertyKey, unknown> }).shape
  return typeof shape === 'object' && shape !== null && key in shape
}
