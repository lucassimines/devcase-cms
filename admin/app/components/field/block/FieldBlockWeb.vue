<template>
  <FormColumns>
    <UFormField :label="$t('desktop')" :name="`${accessorKey}.image.desktop`">
      <FieldImage v-model="model.image.desktop" />
    </UFormField>

    <UFormField :label="$t('mobile')" :name="`${accessorKey}.image.mobile`">
      <FieldImage v-model="model.image.mobile" />
    </UFormField>
  </FormColumns>
</template>

<script setup lang="ts">
import type { WebBlock } from '~/types/block'

defineProps<{
  accessorKey: string
}>()

const model = defineModel<WebBlock>({ required: true })
</script>
