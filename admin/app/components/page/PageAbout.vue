<template>
  <FormTab v-if="model?.profile" :title="$t('content')">
    {{ model }}
    <UFormField :label="$t('title')" name="content.profile.title">
      <UInput v-model="model.profile.title" />
    </UFormField>

    <UFormField :label="$t('profile')" name="content.profile.image">
      <FieldImage v-model="model.profile.image" />
    </UFormField>

    <UFormField :label="$t('title')" name="content.profile.title2">
      <UInput v-model="model.profile.title2.test" />
    </UFormField>
  </FormTab>
</template>

<script setup lang="ts">
import { PAGE_ABOUT_DEFAULT, type PageAbout } from '~/types/page'

const model = defineModel<PageAbout | null | undefined>()

if (!model.value) {
  model.value = structuredClone(PAGE_ABOUT_DEFAULT)
} else {
  mergeDeep(model.value, PAGE_ABOUT_DEFAULT, { onlyIfNil: true })
}
</script>
