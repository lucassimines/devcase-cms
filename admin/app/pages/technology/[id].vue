<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/technology/${route.params.id}`">
    <template #right>
      <ButtonModel entity="technology" />
    </template>

    <template #default="{ state }">
      <FormTab>
        <UFormField :label="$t('name')" name="name">
          <UInput v-model="state.name" />
        </UFormField>

        <UFormField :label="$t('slug')" name="slug">
          <UInput v-model="state.slug" />
        </UFormField>

        <UFormField :label="$t('url')" name="url">
          <UInput v-model="state.url" type="url" />
        </UFormField>

        <UFormField :label="$t('icon')" name="icon">
          <UInput v-model="state.icon" />
        </UFormField>
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { Technology } from '~/types/technology'
import type { ModelInput } from '~/types/utils'

const schema: z.ZodType<ModelInput<Technology>> = z.object({
  name: z.string().min(2).default(''),
  slug: z.string().default(''),
  icon: z.string().default(''),
  url: z.url().or(z.literal('')).optional()
})

const route = useRoute()
</script>
