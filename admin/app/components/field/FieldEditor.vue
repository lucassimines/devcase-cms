<template>
  <UFormField :label="label" :name="fieldName">
    <NavTranslate v-model="locale" :translate="translate">
      <UEditor
        v-slot="{ editor }"
        v-model="localizedModel"
        content-type="html"
        :ui="{ root: 'bg-default rounded-md w-full', content: 'min-h-74 py-6' }"
        :placeholder="$t('editor.placeholder')"
      >
        <UEditorToolbar
          :editor="editor"
          :items="items"
          class="border-muted overflow-x-auto border-b p-2"
        >
          <template #link>
            <EditorLinkPopover :editor="editor" auto-open />
          </template>
        </UEditorToolbar>
      </UEditor>
    </NavTranslate>
  </UFormField>
</template>

<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import { DEFAULT_LOCALE, type LocaleCode } from '~/types/locale'

const props = defineProps<{
  label?: string
  name: string
  translate?: boolean
}>()

const model = defineModel<string | Record<string, string>>({ required: true })

const locale = ref<LocaleCode>(DEFAULT_LOCALE)

const { defineLocalizedModel, normalizeFieldName } = useLocalizedModel(props.translate, locale)

const fieldName = normalizeFieldName(props.name)

const localizedModel = defineLocalizedModel(model)

const items = [
  [
    {
      icon: 'i-lucide-heading',
      content: {
        align: 'start'
      },
      items: [
        {
          kind: 'heading',
          level: 1,
          icon: 'i-lucide-heading-1',
          label: 'Heading 1'
        },
        {
          kind: 'heading',
          level: 2,
          icon: 'i-lucide-heading-2',
          label: 'Heading 2'
        },
        {
          kind: 'heading',
          level: 3,
          icon: 'i-lucide-heading-3',
          label: 'Heading 3'
        },
        {
          kind: 'heading',
          level: 4,
          icon: 'i-lucide-heading-4',
          label: 'Heading 4'
        }
      ]
    }
  ],
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: 'i-lucide-bold'
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: 'i-lucide-italic'
    },
    {
      kind: 'mark',
      mark: 'underline',
      icon: 'i-lucide-underline'
    },
    {
      kind: 'mark',
      mark: 'strike',
      icon: 'i-lucide-strikethrough'
    },
    {
      kind: 'mark',
      mark: 'code',
      icon: 'i-lucide-code'
    },
    {
      slot: 'link' as const,
      icon: 'i-lucide-link'
    }
  ]
] satisfies EditorToolbarItem[][]
</script>
