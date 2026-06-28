<template>
  <ResourceFormUpdate :schema="schema" :endpoint="`/page/${route.params.id}`">
    <template #right>
      <ButtonModel entity="page" />
    </template>

    <template #default="{ state }">
      <FormTab>
        <FieldText v-model="state.name" :label="$t('name')" name="name" translate />

        <FieldText v-model="state.slug" :label="$t('slug')" name="slug" />

        <FieldText v-model="state.code" :label="$t('code')" name="code" />
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
import PageHome from '~/components/page/PageHome.vue'
import type { PageUpdate } from '~/types/page'
import type { ModelInput } from '~/types/utils'

const route = useRoute()

const componentContentMap: Record<string, Component> = {
  home: PageHome
}

function getContentSchema(code: string) {
  switch (code) {
    case 'home':
      return z.object({
        intro: z.object({
          title: localizedStringSchema(),
          description: localizedStringSchema()
        })
      })

    default:
      return z.object({})
  }
}

const schema = z
  .object({
    name: localizedStringSchema(z.string().min(2)),
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
