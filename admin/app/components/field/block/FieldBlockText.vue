<template>
  <UFormField :name="`${accessorKey}.text`">
    <FieldEditor v-model="model.text" />
  </UFormField>
</template>

<script setup lang="ts">
import type { TextBlock } from '~/types/block'

defineProps<{
  accessorKey: string
}>()

const model = defineModel<TextBlock>({ required: true })
</script>
