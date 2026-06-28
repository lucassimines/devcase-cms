import type { infer as Infer, ZodObject, ZodType } from 'zod'

function getZodObjectShape(schema: ZodType): Record<PropertyKey, unknown> | null {
  const shape = (schema as { shape?: Record<PropertyKey, unknown> }).shape
  if (typeof shape === 'object' && shape !== null) {
    return shape
  }

  const def = (schema as { def?: { type?: string; in?: ZodType } }).def
  if (def?.type === 'pipe' && def.in) {
    return getZodObjectShape(def.in)
  }

  return null
}

/** True when `schema` is a Zod object (e.g. `z.object`) and `key` is in its `.shape`. */
export function hasZodSchemaProp<S extends ZodObject, K extends PropertyKey>(
  schema: S,
  key: K
): key is K & keyof Infer<S>

export function hasZodSchemaProp(schema: ZodType, key: PropertyKey): boolean

export function hasZodSchemaProp(schema: ZodType, key: PropertyKey): boolean {
  const shape = getZodObjectShape(schema)
  return shape !== null && key in shape
}
