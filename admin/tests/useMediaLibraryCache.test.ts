import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { File } from '~/types/file'
import { useMediaLibraryCache } from '~/composables/useMediaLibraryCache'

type StateRef<T> = { value: T }

type StateStore = Map<string, StateRef<unknown>>

const createUseStateMock = (store: StateStore) => {
  return <T>(key: string, init?: (() => T) | T): StateRef<T> => {
    if (!store.has(key)) {
      const initialValue = typeof init === 'function' ? (init as () => T)() : (init as T)
      store.set(key, { value: initialValue })
    }

    return store.get(key) as StateRef<T>
  }
}

const makeFile = (id: string): File => ({
  id,
  filename: `file-${id}.jpg`,
  extension: 'jpg',
  mime: 'image/jpeg',
  size: 1024
})

describe('useMediaLibraryCache', () => {
  let store: StateStore

  beforeEach(() => {
    store = new Map()
    vi.unstubAllGlobals()
    vi.stubGlobal('useState', createUseStateMock(store))
  })

  it('fetches once and shares state across composable calls', () => {
    const first = useMediaLibraryCache()

    first.setFromResponse({
      data: [makeFile('1')],
      meta: { total: 1, page: 1, limit: 60, last_page: 1 }
    })

    expect(first.hasFetchedOnce.value).toBe(true)
    expect(first.mediaFiles.value).toHaveLength(1)

    const second = useMediaLibraryCache()

    expect(second.hasFetchedOnce.value).toBe(true)
    expect(second.mediaFiles.value).toEqual(first.mediaFiles.value)
    expect(second.mediaMeta.value?.total).toBe(1)
  })

  it('updates local list and pagination metadata on prepend/remove', () => {
    const cache = useMediaLibraryCache()

    cache.setFromResponse({
      data: [makeFile('1')],
      meta: { total: 1, page: 1, limit: 60, last_page: 1 }
    })

    cache.prependFiles([makeFile('2'), makeFile('3')])

    expect(cache.mediaFiles.value.map((file) => file.id)).toEqual(['2', '3', '1'])
    expect(cache.mediaMeta.value?.total).toBe(3)
    expect(cache.mediaMeta.value?.last_page).toBe(1)

    cache.removeFile('file-2.jpg')

    expect(cache.mediaFiles.value.map((file) => file.id)).toEqual(['3', '1'])
    expect(cache.mediaMeta.value?.total).toBe(2)
    expect(cache.mediaMeta.value?.last_page).toBe(1)
  })
})
