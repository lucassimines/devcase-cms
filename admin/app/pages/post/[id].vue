<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/post/${route.params.id}`">
    <template #right>
      <UButton
        :icon="$entities.post.icon"
        :label="$t('entity.post.name', 2)"
        variant="soft"
        color="neutral"
        :to="{ name: 'post-id', params: { id: route.params.id } }"
      />
    </template>

    <template #default="{ state }">
      <FormTab>
        <FieldText v-model="state.name" :label="$t('name')" name="name" translate />

        <FieldText v-model="state.slug" :label="$t('slug')" name="slug" />

        <FieldTextarea v-model="state.excerpt" :label="$t('excerpt')" name="excerpt" translate />

        <FieldImage v-model="state.image" name="image" translate />
      </FormTab>

      <FormTab :title="$t('content')">
        <FieldEditor v-model="state.content" name="content" translate />
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { PostUpdate } from '~/types/post'
import type { ModelInput } from '~/types/utils'

const { $entities } = useNuxtApp()

const schema: z.ZodType<ModelInput<PostUpdate>> = z.object({
  name: localizedStringSchema(z.string().min(2)),
  published: z.boolean().default(false),
  order: z.number().default(0),
  excerpt: localizedStringSchema(),
  content: localizedStringSchema(),
  image: localizedStringSchema(),
  slug: z.string().default('')
})

const route = useRoute()
</script>
