<template>
  <UFormField :label="$t('image')" :name="`${accessorKey}.image`">
    <FieldImage v-model="model.image" />
  </UFormField>
</template>

<script setup lang="ts">
import type { ImageBlock } from '~/types/block'

defineProps<{
  accessorKey: string
}>()

const model = defineModel<ImageBlock>({ required: true })
</script>
