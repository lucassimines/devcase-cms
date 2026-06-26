<template>
  <UFormField :label="label" :name="fieldName">
    <UTextarea v-if="!translate && typeof model === 'string'" v-model="model" :rows="rows" />

    <NavTranslate v-else v-model="currentLocale">
      <UTextarea v-model="localizedModel" :rows="rows" />
    </NavTranslate>
  </UFormField>
</template>

<script setup lang="ts">
import { DEFAULT_LOCALE, type LocaleCode } from '~/types/locale'

interface Props {
  name: string
  label: string
  rows?: number
  translate?: boolean
}

const props = defineProps<Props>()

const model = defineModel<string | Record<string, string>>({ required: true })

const currentLocale = ref<LocaleCode>(DEFAULT_LOCALE)

const { defineLocalizedModel, normalizeFieldName } = useLocalizedModel(currentLocale)

const fieldName = normalizeFieldName(props.name, props.translate)

const localizedModel = defineLocalizedModel(model)
</script>
