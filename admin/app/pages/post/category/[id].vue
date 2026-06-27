<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`${$entities.category.path}/${route.params.id}`">
    <template #right>
      <UButton
        :icon="$entities.category.icon"
        :label="$t('entity.category.name', 2)"
        variant="soft"
        color="neutral"
        :to="{ name: 'post-category-id', params: { id: route.params.id } }"
      />
    </template>

    <template #default="{ state }">
      <FormTab>
        <FieldText v-model="state.name" :label="$t('name')" name="name" translate />

        <FieldText v-model="state.slug" :label="$t('slug')" name="slug" />

        <UFormField :label="$t('entity.category.parent')" name="parentId">
          <USelectMenu
            v-model="state.parentId"
            :items="parentItems"
            value-key="value"
            :placeholder="$t('select.label')"
          />
        </UFormField>
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { Category, CategoryUpdate } from '~/types/category'
import type { ModelInput } from '~/types/utils'

const { $entities, $tr } = useNuxtApp()

const route = useRoute()

const schema: z.ZodType<ModelInput<CategoryUpdate>> = z.object({
  name: localizedStringSchema(z.string().min(2)),
  type: z.enum(['POST']),
  order: z.number().default(0),
  slug: z.string().default(''),
  parentId: z.string().nullable().default(null)
})

const { data: categories } = useAdminApi<Category[]>(() => `${$entities.category.path}/all`)

const parentItems = computed(() => {
  const currentId = route.params.id as string

  return [
    { label: $t('entity.category.noParent'), value: null },
    ...(categories.value
      ?.filter((category) => category.id !== currentId)
      .map((category) => ({
        label: $tr(category.name),
        value: category.id
      })) ?? [])
  ]
})
</script>
