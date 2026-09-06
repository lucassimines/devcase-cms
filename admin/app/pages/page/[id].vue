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

      <component :is="componentContentMap[state.code]" v-model="state.content" :code="state.code" />

      <FormTab :title="$t('block', 2)">
        <FieldBlockRepeater v-model="state.blocks" />
      </FormTab>
    </template>
  </ResourceFormUpdate>
</template>

<script setup lang="ts">
import * as z from 'zod'
import PageHome from '~/components/page/PageHome.vue'
import PagePriceFlip from '~/components/page/PagePriceFlip.vue'
import PageTools from '~/components/page/PageTools.vue'
import type { PageUpdate } from '~/types/page'
import type { ModelInput } from '~/types/utils'

const route = useRoute()

const componentContentMap: Record<string, Component> = {
  home: PageHome,
  tools: PageTools,
  priceflip: PagePriceFlip
}

const localizedItemSchema = z.object({
  title: localizedStringSchema(),
  description: localizedStringSchema()
})

function getContentSchema(code: string) {
  switch (code) {
    case 'home':
      return z.object({
        intro: z.object({
          title: localizedStringSchema(),
          description: localizedStringSchema()
        }),
        projects: z.object({
          title: localizedStringSchema(),
          cta_text: localizedStringSchema()
        }),
        tools: z.object({
          title: localizedStringSchema(),
          cta_text: localizedStringSchema()
        }),
        priceflip: z.object({
          heading: z.object({
            title: localizedStringSchema()
          }),
          badge: localizedStringSchema(),
          title: localizedStringSchema(),
          description: localizedStringSchema(),
          cta_text: localizedStringSchema(),
          image: localizedStringSchema()
        })
      })

    case 'tools':
      return z.object({
        intro: z.object({
          title: localizedStringSchema(),
          description: localizedStringSchema()
        })
      })

    case 'priceflip':
      return z.object({
        seo: z.object({
          title: localizedStringSchema(),
          description: localizedStringSchema(),
          keywords: localizedStringSchema()
        }),
        hero: z.object({
          badge: localizedStringSchema(),
          title: localizedStringSchema(),
          subtitle: localizedStringSchema(),
          description: localizedStringSchema(),
          image: localizedStringSchema()
        }),
        highlights: z.array(localizedItemSchema).default([]),
        how_it_works: z.object({
          title: localizedStringSchema(),
          items: z.array(localizedItemSchema).default([])
        }),
        features: z.object({
          title: localizedStringSchema(),
          items: z.array(localizedItemSchema).default([])
        }),
        download: z.object({
          title: localizedStringSchema(),
          description: localizedStringSchema(),
          ios_label: localizedStringSchema(),
          android_label: localizedStringSchema(),
          android_soon: localizedStringSchema(),
          ios_url: z.string().default(''),
          android_url: z.string().default('')
        }),
        faq: z.object({
          title: localizedStringSchema(),
          items: z
            .array(
              z.object({
                question: localizedStringSchema(),
                answer: localizedStringSchema()
              })
            )
            .default([])
        }),
        privacy_label: localizedStringSchema()
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
