<template>
  <FieldEditor v-model="model.text" :name="`${accessorKey}.text`" translate />
</template>

<script setup lang="ts">
import type { TextBlock } from '~/types/block'

defineProps<{
  accessorKey: string
}>()

const model = defineModel<TextBlock>({ required: true })
</script>
