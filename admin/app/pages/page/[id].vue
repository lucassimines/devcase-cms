<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/page/${route.params.id}`">
    <template #right>
      <UButton
        :icon="$entities.page.icon"
        :label="$t('entity.page.name', 2)"
        variant="soft"
        color="neutral"
        :to="{ name: 'page-id', params: { id: route.params.id } }"
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

        <UFormField :label="$t('code')" name="code">
          <UInput v-model="state.code" />
        </UFormField>
      </FormTab>

      <FormTab :title="$t('block', 2)">
        <FieldBlockRepeater v-model="state.blocks" />
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { PageUpdate } from '~/types/page'
import type { ModelInput } from '~/types/utils'

const { $entities } = useNuxtApp()

const schema: z.ZodType<ModelInput<PageUpdate>> = z.object({
  name: z.string().min(2).default(''),
  code: z.string().min(2).default(''),
  published: z.boolean().default(false),
  slug: z.string().default(''),
  blocks: z.array(z.any()).default([])
})

const route = useRoute()
</script>
