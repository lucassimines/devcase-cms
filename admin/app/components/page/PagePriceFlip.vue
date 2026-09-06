<template>
  <template v-if="model">
    <FormTab :title="$t('seo')">
      <FieldText
        v-model="model.seo.title"
        :label="$t('seoTitle')"
        name="content.seo.title"
        translate
      />

      <FieldTextarea
        v-model="model.seo.description"
        :label="$t('seoDescription')"
        name="content.seo.description"
        :rows="4"
        translate
      />

      <FieldText
        v-model="model.seo.keywords"
        :label="$t('keywords')"
        name="content.seo.keywords"
        translate
      />
    </FormTab>

    <FormTab :title="$t('hero')">
      <FieldText
        v-model="model.hero.badge"
        :label="$t('badge')"
        name="content.hero.badge"
        translate
      />

      <FieldText
        v-model="model.hero.title"
        :label="$t('title')"
        name="content.hero.title"
        translate
      />

      <FieldText
        v-model="model.hero.subtitle"
        :label="$t('subtitle')"
        name="content.hero.subtitle"
        translate
      />

      <FieldTextarea
        v-model="model.hero.description"
        :label="$t('description')"
        name="content.hero.description"
        :rows="8"
        translate
      />

      <FieldImage
        v-model="model.hero.image"
        :label="$t('image')"
        name="content.hero.image"
        translate
      />
    </FormTab>

    <FormTab :title="$t('highlights')">
      <FieldRepeater
        v-model="model.highlights"
        name="content.highlights"
        :default-item="PRICEFLIP_TEXT_ITEM_DEFAULT"
        :label="$t('highlights')"
      >
        <template #default="{ accessorKey, model: item }">
          <FieldText
            v-model="item.title"
            :label="$t('title')"
            :name="`${accessorKey}.title`"
            translate
          />

          <FieldTextarea
            v-model="item.description"
            :label="$t('description')"
            :name="`${accessorKey}.description`"
            :rows="4"
            translate
          />
        </template>
      </FieldRepeater>
    </FormTab>

    <FormTab :title="$t('howItWorks')">
      <FieldText
        v-model="model.how_it_works.title"
        :label="$t('title')"
        name="content.how_it_works.title"
        translate
      />

      <FieldRepeater
        v-model="model.how_it_works.items"
        name="content.how_it_works.items"
        :default-item="PRICEFLIP_TEXT_ITEM_DEFAULT"
        :label="$t('item', 2)"
      >
        <template #default="{ accessorKey, model: item }">
          <FieldText
            v-model="item.title"
            :label="$t('title')"
            :name="`${accessorKey}.title`"
            translate
          />

          <FieldTextarea
            v-model="item.description"
            :label="$t('description')"
            :name="`${accessorKey}.description`"
            :rows="4"
            translate
          />
        </template>
      </FieldRepeater>
    </FormTab>

    <FormTab :title="$t('features')">
      <FieldText
        v-model="model.features.title"
        :label="$t('title')"
        name="content.features.title"
        translate
      />

      <FieldRepeater
        v-model="model.features.items"
        name="content.features.items"
        :default-item="PRICEFLIP_TEXT_ITEM_DEFAULT"
        :label="$t('item', 2)"
      >
        <template #default="{ accessorKey, model: item }">
          <FieldText
            v-model="item.title"
            :label="$t('title')"
            :name="`${accessorKey}.title`"
            translate
          />

          <FieldTextarea
            v-model="item.description"
            :label="$t('description')"
            :name="`${accessorKey}.description`"
            :rows="4"
            translate
          />
        </template>
      </FieldRepeater>
    </FormTab>

    <FormTab :title="$t('download')">
      <FieldText
        v-model="model.download.title"
        :label="$t('title')"
        name="content.download.title"
        translate
      />

      <FieldTextarea
        v-model="model.download.description"
        :label="$t('description')"
        name="content.download.description"
        :rows="4"
        translate
      />

      <FieldText
        v-model="model.download.ios_label"
        :label="$t('iosLabel')"
        name="content.download.ios_label"
        translate
      />

      <FieldText
        v-model="model.download.android_label"
        :label="$t('androidLabel')"
        name="content.download.android_label"
        translate
      />

      <FieldText
        v-model="model.download.android_soon"
        :label="$t('androidSoon')"
        name="content.download.android_soon"
        translate
      />

      <FieldText
        v-model="model.download.ios_url"
        :label="$t('iosUrl')"
        name="content.download.ios_url"
      />

      <FieldText
        v-model="model.download.android_url"
        :label="$t('androidUrl')"
        name="content.download.android_url"
      />
    </FormTab>

    <FormTab :title="$t('faq')">
      <FieldText
        v-model="model.faq.title"
        :label="$t('title')"
        name="content.faq.title"
        translate
      />

      <FieldRepeater
        v-model="model.faq.items"
        name="content.faq.items"
        :default-item="PRICEFLIP_FAQ_ITEM_DEFAULT"
        :label="$t('faq')"
      >
        <template #default="{ accessorKey, model: item }">
          <FieldText
            v-model="item.question"
            :label="$t('question')"
            :name="`${accessorKey}.question`"
            translate
          />

          <FieldTextarea
            v-model="item.answer"
            :label="$t('answer')"
            :name="`${accessorKey}.answer`"
            :rows="6"
            translate
          />
        </template>
      </FieldRepeater>
    </FormTab>

    <FormTab :title="$t('privacy')">
      <FieldText
        v-model="model.privacy_label"
        :label="$t('privacyLabel')"
        name="content.privacy_label"
        translate
      />
    </FormTab>
  </template>
</template>

<script setup lang="ts">
import {
  PAGE_PRICEFLIP_DEFAULT,
  PRICEFLIP_FAQ_ITEM_DEFAULT,
  PRICEFLIP_TEXT_ITEM_DEFAULT,
  type PagePriceFlip
} from '~/types/page'

const model = defineModel<PagePriceFlip | undefined>()

model.value = useDataNormalizer<PagePriceFlip>(model.value, PAGE_PRICEFLIP_DEFAULT)
</script>
