<template>
  <FormTab v-if="model" :title="$t('content')">
    <UFormField :label="$t('title')" name="content.profile.title">
      <UInput v-model="model.profile.title" />
    </UFormField>

    <UFormField :label="$t('profile')" name="content.profile.image">
      <FieldImage v-model="model.profile.image" />
    </UFormField>
  </FormTab>
</template>

<script setup lang="ts">
import { PAGE_ABOUT_DEFAULT, type PageAbout } from '~/types/page'

const model = defineModel<PageAbout | undefined>()

model.value = useDataNormalizer<PageAbout>(model.value, PAGE_ABOUT_DEFAULT)
</script>
