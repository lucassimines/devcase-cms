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
        <NuxtImg :src="$file(file.filename)" class="h-full max-w-full object-contain" />
      </figure>
    </UButton>

    <footer class="bg-muted flex w-full items-center rounded-b-md p-1">
      <UButton icon="lucide:trash" color="error" variant="soft" size="xs" @click="deleteFile()" />
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
}>()

const { execute: deleteFile } = await useAdminApi<File>(`/file`, {
  method: 'DELETE',
  immediate: false,
  body: {
    filename: props.file.filename
  }
})
</script>
