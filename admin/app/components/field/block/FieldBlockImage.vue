<template>
  <FieldImage v-model="model.image" :name="`${accessorKey}.image`" :label="$t('image')" translate />
</template>

<script setup lang="ts">
import type { ImageBlock } from '~/types/block'

defineProps<{
  accessorKey: string
}>()

const model = defineModel<ImageBlock>({ required: true })
</script>
