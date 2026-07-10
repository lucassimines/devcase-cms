<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/post/${id}`">
    <template #right>
      <ButtonModel entity="post" />
    </template>

    <template #default="{ state }">
      <FormTab>
        <FieldText v-model="state.name" :label="$t('name')" name="name" translate />

        <FieldText v-model="state.slug" :label="$t('slug')" name="slug" />

        <FieldTextarea v-model="state.excerpt" :label="$t('excerpt')" name="excerpt" translate />

        <FieldCategories v-model="state.categories" name="categories" type="POST" />

        <div>
          <PostFormGenerateImage v-model="state.image" :post-id="id" />
        </div>

        <FieldImage v-model="state.image" name="image" translate :ui="{ wrapper: 'aspect-5/3' }" />
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

const schema: z.ZodType<ModelInput<PostUpdate>> = z.object({
  name: localizedStringSchema(z.string().min(2)),
  published: z.boolean().default(false),
  order: z.number().default(0),
  excerpt: localizedStringSchema(),
  content: localizedStringSchema(),
  image: localizedStringSchema(),
  slug: z.string().default(''),
  categories: z.array(z.string()).default([])
})

const route = useRoute()

const id = computed(() => String(route.params.id))
</script>
