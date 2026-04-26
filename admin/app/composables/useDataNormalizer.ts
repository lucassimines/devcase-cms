export function useDataNormalizer<T extends Record<string, unknown>>(
  model: T | null | undefined,
  defaults: T
): T {
  const next = model ? model : structuredClone(defaults)

  mergeDeep(next, defaults, { onlyIfNil: true })

  return next
}
