<template>
  <div class="relative flex flex-col">
    <UButton
      :key="file.id"
      :ui="{ base: 'aspect-square p-2 size-full flex-none rounded-b-none' }"
      color="neutral"
      variant="subtle"
      @click="emit('insert:file')"
    >
      <figure class="flex size-full items-center justify-center overflow-hidden">
        <NuxtImg
          :src="$file(file.filename)"
          preset="mediaLibraryThumb"
          sizes="sm:33vw md:20vw lg:12vw xl:10vw"
          loading="lazy"
          class="h-full max-w-full object-contain"
        />
      </figure>
    </UButton>

    <footer class="bg-muted flex w-full items-center gap-1 rounded-b-md p-1">
      <UButton
        icon="lucide:download"
        color="neutral"
        variant="soft"
        size="xs"
        :href="downloadUrl"
        :download="file.filename"
        target="_blank"
        external
      />

      <UButton
        icon="lucide:trash"
        color="error"
        variant="soft"
        size="xs"
        :loading="status === 'pending'"
        @click="deleteCurrentFile"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { File } from '~/types/file'

const props = defineProps<{
  file: File
}>()

const emit = defineEmits<{
  (e: 'insert:file'): void
  (e: 'delete:file', filename: string): void
}>()

const config = useRuntimeConfig()

const downloadUrl = computed(() => `${config.public.apiUrl}/static/images/${props.file.filename}`)

const { status, execute: deleteFile } = await useAdminApi<File>(`/file`, {
  method: 'DELETE',
  immediate: false,
  body: {
    filename: props.file.filename
  }
})

const confirm = useConfirmDialog()

const { t } = useI18n()

async function deleteCurrentFile() {
  const confirmed = await confirm({
    title: t('dialog.delete.title'),
    description: t('dialog.delete.description')
  })

  if (!confirmed) return

  await deleteFile()
  emit('delete:file', props.file.filename)
}
</script>
