<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/technology/${route.params.id}`">
    <template #right>
      <UButton
        :icon="$entities.technology.icon"
        :label="$t('entity.technology.name', 2)"
        variant="soft"
        color="neutral"
        :to="{ name: 'technology-id', params: { id: route.params.id } }"
      />
    </template>

    <template #default="{ state }">
      <FormTab>
        <UFormField :label="$t('name')" name="name">
          <UInput v-model="state.name" size="xl" class="w-full" />
        </UFormField>

        <UFormField :label="$t('slug')" name="slug">
          <UInput v-model="state.slug" size="xl" class="w-full" />
        </UFormField>

        <UFormField :label="$t('icon')" name="icon">
          <UInput v-model="state.icon" size="xl" class="w-full" />
        </UFormField>
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { Technology } from '~/types/technology'
import type { ModelInput } from '~/types/utils'

const { $entities } = useNuxtApp()

const schema: z.ZodType<ModelInput<Technology>> = z.object({
  name: z.string().min(2).default(''),
  slug: z.string().default(''),
  icon: z.string().default('')
})

const route = useRoute()
</script>
