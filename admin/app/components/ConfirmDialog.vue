<template>
  <UModal
    :title="title"
    :description="description"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton
        :label="cancelLabel"
        color="neutral"
        variant="outline"
        @click="emits('close', false)"
      />
      <UButton :label="confirmLabel" :color="confirmColor" @click="emits('close', true)" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    confirmColor?: 'error' | 'neutral' | 'primary'
  }>(),
  {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmColor: 'neutral'
  }
)

const emits = defineEmits<{
  (e: 'close', value: boolean): void
}>()
</script>
