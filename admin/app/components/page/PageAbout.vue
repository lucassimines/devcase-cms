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
import type { PageAbout } from '~/types/page'

const defaultContent: PageAbout = {
  profile: {
    title: '',
    image: '',
    title2: {
      test: ''
    }
  }
}

const model = defineModel<PageAbout | null | undefined>()

if (!model.value) {
  model.value = structuredClone(defaultContent)
} else {
  mergeDeep(model.value as Record<string, unknown>, defaultContent as Record<string, unknown>, {
    onlyIfNil: true
  })
}
</script>
