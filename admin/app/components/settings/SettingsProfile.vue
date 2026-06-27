<template>
  <FormTab :title="$t('profile')">
    <FieldText v-model="model.role" :label="$t('role')" name="profile.role" translate />

    <FieldText v-model="model.location" :label="$t('location')" name="profile.location" translate />

    <FieldImage v-model="model.image" :label="$t('image')" name="profile.image" translate />
  </FormTab>
</template>

<script setup lang="ts">
import { SETTING_PROFILE_DEFAULT, type SettingProfile } from '~/types/settings'

const model = defineModel<SettingProfile>({ required: true })

model.value = useDataNormalizer<SettingProfile>(model.value, SETTING_PROFILE_DEFAULT)
</script>
