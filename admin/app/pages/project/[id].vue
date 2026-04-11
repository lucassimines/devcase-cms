<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/client/${route.params.id}`">
    <template #right>
      <UButton
        :icon="$entities.project.icon"
        :label="t('model.task.name', 2)"
        variant="soft"
        color="neutral"
        :to="{ name: 'client-id-task', params: { id: route.params.id } }"
      />

      <TaskFormCreate />
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
  image: z.string().url().default(''),
  slug: z.string().default(''),
  blocks: z.array(z.any()).default([])
})

const route = useRoute()
</script>
