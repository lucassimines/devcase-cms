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

      <component :is="componentContentMap[state.code]" v-model="state.content" :code="state.code" />
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import PageAbout from '~/components/page/PageAbout.vue'
import PageHome from '~/components/page/PageHome.vue'
import type { PageUpdate } from '~/types/page'
import type { ModelInput } from '~/types/utils'

const { $entities } = useNuxtApp()

const route = useRoute()

const componentContentMap: Record<string, Component> = {
  home: PageHome,
  about: PageAbout
}

function getContentSchema(code: string) {
  switch (code) {
    case 'home':
      return z.object({
        intro: z.object({
          title: z.string().default(''),
          description: z.string().default('')
        })
      })

    case 'about':
      return z.object({
        profile: z.object({
          title: z.string().default(''),
          image: z.string().default('')
        })
      })

    default:
      return z.object({})
  }
}

const schema = z
  .object({
    name: z.string().min(2).default(''),
    code: z.string().min(2).default(''),
    published: z.boolean().default(false),
    slug: z.string().default(''),
    blocks: z.array(z.any()).default([]),
    content: z.unknown().default({})
  })
  .superRefine((val, ctx) => {
    const result = getContentSchema(val.code).safeParse(val.content)
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ['content', ...issue.path] })
      }
    }
  })
  .transform((val) => {
    const result = getContentSchema(val.code).safeParse(val.content)

    return {
      ...val,
      content: result.success ? result.data : val.content
    }
  }) as z.ZodType<ModelInput<PageUpdate>>
</script>
