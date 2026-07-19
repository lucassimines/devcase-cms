<template>
  <template v-if="model">
    <FormTab :title="$t('intro')">
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

    <FormTab :title="$t('entity.project.name', 2)">
      <FieldText
        v-model="model.projects.title"
        :label="$t('title')"
        name="content.projects.title"
        translate
      />

      <FieldText
        v-model="model.projects.cta_text"
        :label="$t('ctaText')"
        name="content.projects.cta_text"
        translate
      />
    </FormTab>

    <FormTab :title="$t('tools')">
      <FieldText
        v-model="model.tools.title"
        :label="$t('title')"
        name="content.tools.title"
        translate
      />

      <FieldText
        v-model="model.tools.cta_text"
        :label="$t('ctaText')"
        name="content.tools.cta_text"
        translate
      />
    </FormTab>
  </template>
</template>

<script setup lang="ts">
import { PAGE_HOME_DEFAULT, type PageHome } from '~/types/page'

const model = defineModel<PageHome | undefined>()

model.value = useDataNormalizer<PageHome>(model.value, PAGE_HOME_DEFAULT)
</script>
