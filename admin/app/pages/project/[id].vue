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
        <FieldText v-model="state.name" :label="$t('name')" name="name" translate />

        <FieldText v-model="state.slug" :label="$t('slug')" name="slug" />

        <FieldText v-model="state.url" :label="$t('url')" name="url" translate />

        <FieldTextarea
          v-model="state.description"
          :label="$t('description')"
          name="description"
          translate
        />

        <FieldImage v-model="state.background" name="background" translate />

        <FieldImage v-model="state.image" name="image" translate />
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

const { $entities, $tr } = useNuxtApp()

const schema: z.ZodType<ModelInput<ProjectUpdate>> = z.object({
  name: localizedStringSchema(z.string().min(2)),
  published: z.boolean().default(false),
  order: z.number().default(0),
  url: localizedStringSchema(z.union([z.url(), z.literal('')])),
  description: localizedStringSchema(),
  background: localizedStringSchema(),
  image: localizedStringSchema(),
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
      label: $tr(solution.name),
      value: solution.id
    })) ?? []
  )
})
</script>
