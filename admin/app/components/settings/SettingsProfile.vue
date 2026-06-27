<template>
  <FormTab :title="$t('profile')">
    <FieldText v-model="model.name" :label="$t('name')" name="profile.name" />

    <FieldText v-model="model.role" :label="$t('role')" name="profile.role" translate />

    <FieldText v-model="model.location" :label="$t('location')" name="profile.location" translate />

    <FieldImage v-model="model.image" :label="$t('image')" name="profile.image" translate />

    <FieldText
      v-model="model.resumeUrl"
      :label="$t('resumeUrl')"
      name="profile.resumeUrl"
      translate
    />

    <FieldText v-model="model.email" :label="$t('email')" name="profile.email" />
  </FormTab>
</template>

<script setup lang="ts">
import { SETTING_PROFILE_DEFAULT, type SettingProfile } from '~/types/settings'

const model = defineModel<SettingProfile>({ required: true })

model.value = useDataNormalizer<SettingProfile>(model.value, SETTING_PROFILE_DEFAULT)
</script>
