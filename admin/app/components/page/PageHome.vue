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
import { PAGE_HOME_DEFAULT, type PageHome } from '~/types/page'

const model = defineModel<PageHome | undefined>()

model.value = useDataNormalizer<PageHome>(model.value, PAGE_HOME_DEFAULT)
</script>
