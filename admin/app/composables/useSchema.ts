/**
 * Deep merge: applies source onto target so that nested values from source replace target.
 * Arrays and primitives are replaced; plain objects are merged recursively.
 */
export function useSchema<T>() {
  function mergeState(defaultState: T, item: T): T {
    if (item === null || item === undefined) return defaultState
    if (typeof item !== 'object' || Array.isArray(item)) return item as T

    const result = { ...defaultState } as Record<string, unknown>
    const source = item as Record<string, unknown>

    for (const key of Object.keys(source)) {
      const def = result[key]
      const val = source[key]

      if (val === null || val === undefined) continue

      if (Array.isArray(val)) {
        result[key] = val
        continue
      }
      if (
        typeof val === 'object' &&
        typeof def === 'object' &&
        def !== null &&
        !Array.isArray(def)
      ) {
        result[key] = mergeState(def as T, val as T)
        continue
      }
      result[key] = val
    }
    return result as T
  }

  /**
   * Deeply traverses a value and replaces all arrays with empty arrays,
   * preserving the original object structure.
   *
   * Objects are recursively processed.
   * Primitive values and null are returned unchanged.
   */
  function deepNormalizeArrays<T>(value: T): T {
    if (Array.isArray(value)) {
      return [] as T
    }

    if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, deepNormalizeArrays(val)])
      ) as T
    }

    return value
  }

  return {
    mergeState,
    deepNormalizeArrays
  }
}
