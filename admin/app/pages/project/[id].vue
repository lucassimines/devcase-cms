<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/project/${route.params.id}`">
    <template #right>
      <UButton
        :icon="$entities.project.icon"
        :label="t('entity.project.name', 2)"
        variant="soft"
        color="neutral"
        :to="{ name: 'project-id', params: { id: route.params.id } }"
      />
    </template>

    <template #default="{ state }">
      <FormTab>
        <UFormField :label="t('name')" name="name">
          <UInput v-model="state.name" size="xl" class="w-full" />
        </UFormField>
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'

const { t } = useI18n()

const { $entities } = useNuxtApp()

const schema: z.ZodType<ModelInput<Project>> = z.object({
  name: z.string().min(2).default(''),
  published: z.boolean().default(false),
  url: z.url().default(''),
  description: z.string().default(''),
  image: z.url().default(''),
  slug: z.string().default(''),
  blocks: z.array(z.any()).default([])
})

const route = useRoute()
</script>
