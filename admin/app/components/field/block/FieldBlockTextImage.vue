<template>
  <UFormField :label="$t('image')" :name="`${accessorKey}.image`">
    <FieldImage v-model="model.image" />
  </UFormField>

  <UFormField :label="$t('title')" :name="`${accessorKey}.title`">
    <UInput v-model="model.title" />
  </UFormField>

  <FieldEditor v-model="model.text" :label="$t('text')" :name="`${accessorKey}.text`" />

  <UFormField :label="$t('textPosition')" :name="`${accessorKey}.textPosition`">
    <USelect v-model="model.textPosition" value-key="value" :items="textPositionOptions" />
  </UFormField>
</template>

<script setup lang="ts">
import type { TextImageBlock } from '~/types/block'

defineProps<{
  accessorKey: string
}>()

const model = defineModel<TextImageBlock>({ required: true })

const textPositionOptions = computed(() => {
  return [
    { label: $t('left'), value: 'left' },
    { label: $t('right'), value: 'right' }
  ]
})
</script>
