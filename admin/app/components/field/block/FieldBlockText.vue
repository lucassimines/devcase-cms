<template>
  <UFormField :label="$t('block.text')" :name="`${accessorKey}.text`">
    <UTextarea v-model="model.text" size="xl" class="w-full" />
  </UFormField>
</template>

<script setup lang="ts">
import type { TextBlock } from '~/types/block'

defineProps<{
  accessorKey: string
}>()

const model = defineModel<TextBlock>({ required: true })
</script>
