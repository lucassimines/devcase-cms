<template>
  <FieldImage v-model="model.image" :name="`${accessorKey}.image`" :label="$t('image')" translate />

  <FieldText v-model="model.title" :label="$t('title')" name="title" translate />

  <FieldEditor v-model="model.text" :label="$t('text')" :name="`${accessorKey}.text`" translate />

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
