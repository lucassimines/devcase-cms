export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

type PathKey = string | number

function toPath(path: string | PathKey[]): PathKey[] {
  if (Array.isArray(path)) return path
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment))
}

/**
 * Mutates `target` by setting `value` at `path` (lodash-style), then returns `target`.
 *
 * Examples:
 * set(obj, 'profile.name', 'Lucas')
 * set(obj, 'blocks[0].title', 'Hello')
 */
export function set<T extends Record<string, unknown>>(
  target: T,
  path: string | PathKey[],
  value: unknown,
  options?: { onlyIfNil?: boolean }
): T {
  const segments = toPath(path)
  if (!segments.length) return target

  let cursor: unknown = target

  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i]
    const nextKey = segments[i + 1]

    if (typeof cursor !== 'object' || cursor === null) return target

    const record = cursor as Record<string, unknown>
    const current = record[String(key)]

    if (current == null || typeof current !== 'object') {
      record[String(key)] = typeof nextKey === 'number' ? [] : {}
    }

    cursor = record[String(key)]
  }

  const lastKey = segments[segments.length - 1]
  if (typeof cursor === 'object' && cursor !== null) {
    const record = cursor as Record<string, unknown>
    const key = String(lastKey)
    if (!options?.onlyIfNil || record[key] == null) {
      record[key] = value
    }
  }

  return target
}

/**
 * Deeply merges `defaults` into `target`.
 * When `onlyIfNil` is true, existing non-null values are preserved.
 */
export function mergeDeep<T extends Record<string, unknown>>(
  target: T,
  defaults: Record<string, unknown>,
  options?: { onlyIfNil?: boolean }
): T {
  const output = target as Record<string, unknown>

  for (const [key, defaultValue] of Object.entries(defaults)) {
    const currentValue = output[key]

    if (
      defaultValue &&
      typeof defaultValue === 'object' &&
      !Array.isArray(defaultValue) &&
      Object.getPrototypeOf(defaultValue) === Object.prototype
    ) {
      if (
        !currentValue ||
        typeof currentValue !== 'object' ||
        Array.isArray(currentValue) ||
        Object.getPrototypeOf(currentValue) !== Object.prototype
      ) {
        output[key] = {}
      }

      mergeDeep(
        output[key] as Record<string, unknown>,
        defaultValue as Record<string, unknown>,
        options
      )
      continue
    }

    if (!options?.onlyIfNil || currentValue == null) {
      output[key] = defaultValue
    }
  }

  return target
}
