<template>
  <FormTab v-if="model" :title="$t('content')">
    <FieldText
      v-model="model.profile.title"
      :label="$t('title')"
      name="content.profile.title"
      translate
    />

    <FieldImage
      v-model="model.profile.image"
      :label="$t('profile')"
      name="content.profile.image"
      translate
    />
  </FormTab>
</template>

<script setup lang="ts">
import { PAGE_ABOUT_DEFAULT, type PageAbout } from '~/types/page'

const model = defineModel<PageAbout | undefined>()

model.value = useDataNormalizer<PageAbout>(model.value, PAGE_ABOUT_DEFAULT)
</script>
