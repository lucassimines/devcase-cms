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
        <FieldText v-model="state.name" :label="$t('name')" name="name" translate />
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
  name: localizedStringSchema(z.string().min(2)),
  order: z.number().int().default(0)
})

const route = useRoute()
</script>
