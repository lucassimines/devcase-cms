<template>
  <UFormField v-if="categoryItems.length" :label="$t('entity.category.name', 2)" :name="name">
    <USelectMenu
      v-model="model"
      :items="categoryItems"
      value-key="value"
      multiple
      :placeholder="$t('select.label')"
    />
  </UFormField>
</template>

<script setup lang="ts">
import type { Category, CategoryType } from '~/types/category'

const props = defineProps<{
  name: string
  type: CategoryType
}>()

const model = defineModel<string[]>({ required: true })

const { $tr } = useNuxtApp()

const { data: categories } = useAdminApi<Category[]>(
  () => `/category/${props.type.toLowerCase()}/all`
)

const categoryItems = computed(() => {
  return (
    categories.value?.map((category) => ({
      label: $tr(category.name),
      value: category.id
    })) ?? []
  )
})
</script>
