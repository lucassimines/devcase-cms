<template>
  <UModal
    :title="t('image')"
    :ui="{ content: 'sm:max-w-4xl', body: 'py-0 sm:py-0' }"
    @after:enter="fetchFiles"
  >
    <slot />

    <template #body="{ close }">
      <div class="flex max-sm:flex-col gap-4 sm:gap-6 overflow-hidden">
        <div
          class="max-sm:order-2 grow grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 h-96 max-h-[80vh] overflow-y-auto pb-4 sm:py-6"
        >
          <div v-for="file in mediaFiles" :key="file.id">
            <UButton
              :key="file.id"
              v-model="state.files"
              :ui="{ base: 'aspect-square p-2 size-full' }"
              color="neutral"
              variant="subtle"
              @click="insertImage(file, close)"
            >
              <figure class="rounded-sm overflow-hidden flex items-center justify-center size-full">
                <NuxtImg :src="$file(file.filename)" class="max-w-full h-full object-contain" />
              </figure>
            </UButton>
          </div>
        </div>

        <div class="pt-4 sm:py-6">
          <label>
            <input ref="fileInput" type="file" multiple hidden @input="uploadFiles" />

            <UButton
              variant="subtle"
              color="neutral"
              :label="t('button.upload')"
              icon="lucide:upload"
              :loading="isUploading"
              @click="triggerFileInput"
            />
          </label>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-center w-full">
        <UPagination
          v-model:page="paginationQuery.page"
          :items-per-page="paginationQuery.limit"
          :total="files?.meta.total"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { File } from '~/types/file'
import type { PaginationQuery } from '~/types/pagination'
import type { PaginatedTableList } from '~/types/table-list'

const model = defineModel<string | null | undefined>({ required: true })

const { t } = useI18n()

const _schema = z.object({
  files: z.array(z.instanceof(File))
})

type Schema = z.infer<typeof _schema>

const fileInput = ref<HTMLInputElement>()

function triggerFileInput() {
  if (!fileInput.value) return

  // Clear file input value
  fileInput.value.value = ''

  fileInput.value?.click()
}

const state = reactive<Partial<Schema>>({
  files: []
})

const insertImage = (file: File, close: () => void) => {
  model.value = file.filename
  close()
}

const paginationQuery = ref<PaginationQuery>({
  page: 1,
  limit: 20
})

const { data: files, execute: fetchFiles } = await useAdminApi<PaginatedTableList<File>>('/file', {
  immediate: false,
  query: paginationQuery
})

const mediaFiles = ref<File[]>([])

watch(files, (newFiles) => {
  mediaFiles.value = newFiles?.data ?? []
})

const notify = useNotification()

const isUploading = ref(false)

async function uploadFiles(event: Event) {
  const input = event.target as HTMLInputElement

  const formData = new FormData()

  Object.values(input.files ?? []).forEach((f: Blob) => formData.append('form_files', f))

  isUploading.value = true

  try {
    const res = await $adminApi<File[]>('/file/create', {
      method: 'POST',
      body: formData
    })

    isUploading.value = false

    if (res?.length) {
      mediaFiles.value = [...res, ...mediaFiles.value]

      notify.success({ description: t('notification.file.upload.success') })

      return
    }
  } catch {
    isUploading.value = false

    notify.error({ description: t('notification.file.upload.error') })
  }
}
</script>
