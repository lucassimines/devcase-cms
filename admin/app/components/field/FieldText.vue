<template>
  <UFormField :label="label" :name="fieldName">
    <NavTranslate v-model="locale" :translate="translate">
      <UInput v-model="localizedModel" />
    </NavTranslate>
  </UFormField>
</template>

<script setup lang="ts">
import { DEFAULT_LOCALE, type LocaleCode } from '~/types/locale'

interface Props {
  name: string
  label?: string
  translate?: boolean
}

const props = defineProps<Props>()

const model = defineModel<string | Record<string, string>>({ required: true })

const locale = ref<LocaleCode>(DEFAULT_LOCALE)

const { defineLocalizedModel, normalizeFieldName } = useLocalizedModel(props.translate, locale)

const fieldName = normalizeFieldName(props.name)

const localizedModel = defineLocalizedModel(model)
</script>
