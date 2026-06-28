<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/solution/${route.params.id}`">
    <template #right>
      <ButtonModel entity="solution" />
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

const schema: z.ZodType<ModelInput<Solution>> = z.object({
  name: localizedStringSchema(z.string().min(2)),
  order: z.number().int().default(0)
})

const route = useRoute()
</script>
