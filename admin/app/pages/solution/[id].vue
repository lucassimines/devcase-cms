<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/solution/${route.params.id}`">
    <template #right>
      <UButton
        :icon="$entities.solution.icon"
        :label="$t('entity.solution.name', 2)"
        variant="soft"
        color="neutral"
        :to="{ name: 'solution-id', params: { id: route.params.id } }"
      />
    </template>

    <template #default="{ state }">
      <FormTab>
        <UFormField :label="$t('name')" name="name">
          <UInput v-model="state.name" />
        </UFormField>
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { Solution } from '~/types/solution'
import type { ModelInput } from '~/types/utils'

const { $entities } = useNuxtApp()

const schema: z.ZodType<ModelInput<Solution>> = z.object({
  name: z.string().min(2).default(''),
  order: z.number().int().default(0)
})

const route = useRoute()
</script>
