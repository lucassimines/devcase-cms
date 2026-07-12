<template>
  <FormTab v-if="model" :title="$t('content')">
    <FieldText
      v-model="model.intro.title"
      :label="$t('title')"
      name="content.intro.title"
      translate
    />

    <FieldTextarea
      v-model="model.intro.description"
      :label="$t('description')"
      name="content.intro.description"
      :rows="8"
      translate
    />
  </FormTab>
</template>

<script setup lang="ts">
import { PAGE_TOOLS_DEFAULT, type PageTools } from '~/types/page'

const model = defineModel<PageTools | undefined>()

model.value = useDataNormalizer<PageTools>(model.value, PAGE_TOOLS_DEFAULT)
</script>
