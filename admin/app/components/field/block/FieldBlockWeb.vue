<template>
  <FormColumns>
    <FieldImage
      v-model="model.image.desktop"
      :name="`${accessorKey}.image.desktop`"
      :label="$t('desktop')"
      translate
    />

    <FieldImage
      v-model="model.image.mobile"
      :name="`${accessorKey}.image.mobile`"
      :label="$t('mobile')"
      translate
    />
  </FormColumns>
</template>

<script setup lang="ts">
import type { WebBlock } from '~/types/block'

defineProps<{
  accessorKey: string
}>()

const model = defineModel<WebBlock>({ required: true })
</script>
