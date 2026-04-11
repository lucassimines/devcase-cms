export function useResource<T>() {
  const entity = useState<T | null>('entity', () => null)

  function setEntity(data: T) {
    entity.value = data
  }

  return {
    entity,
    setEntity
  }
}
