<template>
  <UModal
    :title="title"
    :description="description"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="emits('close', false)" />
      <UButton label="Confirm" color="neutral" @click="emits('close', true)" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  description?: string
}>()

const emits = defineEmits<{
  (e: 'close', value: boolean): void
}>()
</script>
