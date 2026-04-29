import type { File } from '~/types/file'
import type { PaginatedTableList } from '~/types/table-list'

export function useMediaLibraryCache() {
  const mediaFiles = useState<File[]>('media-library:files', () => [])

  const mediaMeta = useState<PaginatedTableList<File>['meta'] | null>(
    'media-library:meta',
    () => null
  )

  const hasFetchedOnce = useState<boolean>('media-library:has-fetched-once', () => false)

  const isDirty = useState<boolean>('media-library:is-dirty', () => true)

  function setFromResponse(response: PaginatedTableList<File> | null | undefined) {
    mediaFiles.value = response?.data ?? []
    mediaMeta.value = response?.meta ?? null
    hasFetchedOnce.value = true
    isDirty.value = false
  }

  function prependFiles(files: File[]) {
    if (!files.length) return
    mediaFiles.value = [...files, ...mediaFiles.value]
    isDirty.value = true
  }

  function removeFile(filename: string) {
    mediaFiles.value = mediaFiles.value.filter((file) => file.filename !== filename)
    isDirty.value = true
  }

  return {
    mediaFiles,
    mediaMeta,
    hasFetchedOnce,
    isDirty,
    setFromResponse,
    prependFiles,
    removeFile
  }
}
