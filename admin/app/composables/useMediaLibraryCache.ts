import type { File } from '~/types/file'
import type { PaginatedTableList } from '~/types/table-list'

export function useMediaLibraryCache() {
  const mediaFiles = useState<File[]>('media-library:files', () => [])

  const mediaMeta = useState<PaginatedTableList<File>['meta'] | null>(
    'media-library:meta',
    () => null
  )

  const hasFetchedOnce = useState<boolean>('media-library:has-fetched-once', () => false)

  function setFromResponse(response: PaginatedTableList<File> | null | undefined) {
    mediaFiles.value = response?.data ?? []
    mediaMeta.value = response?.meta ?? null
    hasFetchedOnce.value = true
  }

  function prependFiles(files: File[]) {
    if (!files.length) return
    mediaFiles.value = [...files, ...mediaFiles.value]

    if (mediaMeta.value) {
      const total = mediaMeta.value.total + files.length
      const last_page = Math.max(1, Math.ceil(total / mediaMeta.value.limit))
      mediaMeta.value = { ...mediaMeta.value, total, last_page }
    }
  }

  function removeFile(filename: string) {
    const previousLength = mediaFiles.value.length
    mediaFiles.value = mediaFiles.value.filter((file) => file.filename !== filename)

    if (mediaMeta.value && mediaFiles.value.length < previousLength) {
      const total = Math.max(0, mediaMeta.value.total - 1)
      const last_page = Math.max(1, Math.ceil(total / mediaMeta.value.limit))
      mediaMeta.value = { ...mediaMeta.value, total, last_page }
    }
  }

  return {
    mediaFiles,
    mediaMeta,
    hasFetchedOnce,
    setFromResponse,
    prependFiles,
    removeFile
  }
}
