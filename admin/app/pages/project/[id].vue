<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/project/${route.params.id}`">
    <template #right>
      <UButton
        :icon="$entities.project.icon"
        :label="$t('entity.project.name', 2)"
        variant="soft"
        color="neutral"
        :to="{ name: 'project-id', params: { id: route.params.id } }"
      />
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

        <UFormField :label="$t('description')" name="description">
          <UTextarea v-model="state.description" />
        </UFormField>

        <UFormField :label="$t('background')" name="background">
          <FieldImage v-model="state.background" />
        </UFormField>

        <UFormField :label="$t('image')" name="image">
          <FieldImage v-model="state.image" />
        </UFormField>
      </FormTab>

      <FormTab :title="$t('block', 2)">
        <FieldBlockRepeater v-model="state.blocks" />
      </FormTab>

      <FormTab :title="$t('entity.technology.name', 2)">
        <UFormField name="technologies">
          <UCheckboxGroup
            v-model="state.technologies"
            :items="technologyItems"
            orientation="horizontal"
            variant="card"
          />
        </UFormField>
      </FormTab>

      <FormTab :title="$t('entity.solution.name', 2)">
        <UFormField name="solutions">
          <UCheckboxGroup
            v-model="state.solutions"
            :items="solutionItems"
            orientation="horizontal"
            variant="card"
          />
        </UFormField>
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { ProjectUpdate } from '~/types/project'
import type { Solution } from '~/types/solution'
import type { Technology } from '~/types/technology'
import type { ModelInput } from '~/types/utils'

const { $entities } = useNuxtApp()

const schema: z.ZodType<ModelInput<ProjectUpdate>> = z.object({
  name: z.string().min(2).default(''),
  published: z.boolean().default(false),
  url: z.url().or(z.literal('')).optional(),
  description: z.string().default(''),
  background: z.string().default(''),
  image: z.string().default(''),
  slug: z.string().default(''),
  blocks: z.array(z.any()).default([]),
  technologies: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([])
})

const route = useRoute()

const { data: technologies } = useAdminApi<Technology[]>('/technology/all')

const technologyItems = computed(() => {
  return (
    technologies.value?.map((technology) => ({
      label: technology.name,
      value: technology.id
    })) ?? []
  )
})

const { data: solutions } = useAdminApi<Solution[]>('/solution/all')

const solutionItems = computed(() => {
  return (
    solutions.value?.map((solution) => ({
      label: solution.name,
      value: solution.id
    })) ?? []
  )
})
</script>
