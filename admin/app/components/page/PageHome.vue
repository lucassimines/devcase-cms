<template>
  <FormTab v-if="model" :title="$t('content')">
    <UFormField :label="$t('title')" name="content.intro.title">
      <FieldText v-model="model.intro.title" translate />
    </UFormField>

    <UFormField :label="$t('description')" name="content.intro.description">
      <UTextarea v-model="model.intro.description" :rows="8" />
    </UFormField>
  </FormTab>
</template>

<script setup lang="ts">
import { PAGE_HOME_DEFAULT, type PageHome } from '~/types/page'

const model = defineModel<PageHome | undefined>()

model.value = useDataNormalizer<PageHome>(model.value, PAGE_HOME_DEFAULT)
</script>
