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

        <UFormField :label="t('slug')" name="slug">
          <UInput v-model="state.slug" size="xl" class="w-full" />
        </UFormField>

        <UFormField :label="t('description')" name="description">
          <UTextarea v-model="state.description" size="xl" class="w-full" />
        </UFormField>

        <UFormField :label="t('image')" name="image">
          <FieldImage v-model="state.image" size="xl" class="w-full" />
        </UFormField>
      </FormTab>

      <FormTab :title="t('block', 2)">
        <UFormField :label="t('url')" name="url" />
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { Project } from '~/types/project'
import type { ModelInput } from '~/types/utils'

const { t } = useI18n()

const { $entities } = useNuxtApp()

const schema: z.ZodType<ModelInput<Project>> = z.object({
  name: z.string().min(2).default(''),
  published: z.boolean().default(false),
  url: z.url().default(''),
  description: z.string().default(''),
  image: z.string().default(''),
  slug: z.string().default(''),
  blocks: z.array(z.any()).default([])
})

const route = useRoute()
</script>
