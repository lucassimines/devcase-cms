<template>
  <NuxtLayout name="panel">
    <template #header-left>
      <UBreadcrumb :items="breadcrumbs" class="max-md:hidden" />
    </template>

    <template #toolbar>
      <FormTabNav :tabs="tabs" />

      <div class="flex grow items-center justify-end gap-6">
        <UButton
          :label="t('button.save')"
          icon="lucide:check"
          variant="subtle"
          loading-auto
          @click="formRef?.submit()"
        />
      </div>
    </template>

    <UPageCard v-if="status === 'pending'" class="min-h-100 items-start" variant="subtle">
      <USkeleton class="h-8 w-full" />
      <USkeleton class="h-8 w-full" />
      <USkeleton class="h-8 w-1/2" />
    </UPageCard>

    <UForm
      v-else
      ref="formRef"
      :schema="schema"
      :state="state"
      class="space-y-4"
      :loading-auto="false"
      @submit="onSubmit"
    >
      <SettingsProfile v-model="state.profile" />

      <button type="submit" class="hidden" />
    </UForm>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { SETTING_PROFILE_DEFAULT, type SettingProfile, type SettingsData } from '~/types/settings'

const { t } = useI18n()
const notify = useNotification()
const { breadcrumbs } = useBreadcrumbs()
const { tabs } = useFormTabs()

const formRef = useTemplateRef('formRef')

const profileSchema = z.object({
  name: z.string().min(2),
  role: localizedStringSchema(),
  location: localizedStringSchema(),
  image: localizedStringSchema(),
  resumeUrl: localizedStringSchema(),
  email: z.email()
})

const schema = z.object({
  profile: profileSchema.default(SETTING_PROFILE_DEFAULT)
})

type Schema = z.output<typeof schema>

const state = ref<Schema>({
  profile: structuredClone(SETTING_PROFILE_DEFAULT)
})

const { data: settings, status } = await useAdminApi<SettingsData>('/setting')

watch(
  settings,
  (value) => {
    if (!value) return

    state.value.profile = useDataNormalizer<SettingProfile>(value.profile, SETTING_PROFILE_DEFAULT)
  },
  { immediate: true }
)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $adminApi('/setting/profile', {
      method: 'PUT',
      body: event.data.profile
    })

    notify.success()

    // try {
    //   await $adminApi('/revalidate', { method: 'POST' })
    // } catch (revalidateErr: unknown) {
    //   console.warn('ISR revalidate request failed:', revalidateErr)
    // }
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify.error({ description: err.message })
    }
  }
}
</script>
