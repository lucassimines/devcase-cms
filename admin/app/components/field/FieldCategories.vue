<template>
  <UFormField :label="label ?? $t('entity.category.name', 2)" :name="name">
    <UCheckboxGroup
      v-model="model"
      :items="categoryItems"
      orientation="horizontal"
      variant="card"
    />
  </UFormField>
</template>

<script setup lang="ts">
import type { Category } from '~/types/category'

defineProps<{
  name: string
  label?: string
}>()

const model = defineModel<string[]>({ required: true })

const { $entities, $tr } = useNuxtApp()

const { data: categories } = useAdminApi<Category[]>(() => `${$entities.category.path}/all`)

const categoryItems = computed(() => {
  return (
    categories.value?.map((category) => ({
      label: $tr(category.name),
      value: category.id
    })) ?? []
  )
})
</script>
