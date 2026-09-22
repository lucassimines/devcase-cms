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
      <FormTab :title="$t('content')">
        <FieldEditor
          v-model="state.content"
          :label="$t('content')"
          name="content"
          content-type="markdown"
          translate
        />
      </FormTab>

      <button type="submit" class="hidden" />
    </UForm>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { RESUME_DEFAULT, type ResumeData } from '~/types/resume'

const { t } = useI18n()
const notify = useNotification()
const { breadcrumbs } = useBreadcrumbs()
const { tabs } = useFormTabs()

const formRef = useTemplateRef('formRef')

const schema = z.object({
  content: localizedStringSchema()
})

type Schema = z.output<typeof schema>

const state = ref<Schema>({
  content: structuredClone(RESUME_DEFAULT.content)
})

const { data: resume, status } = await useAdminApi<ResumeData>('/resume')

watch(
  resume,
  (value) => {
    if (!value) return

    state.value.content = useDataNormalizer(value.content, structuredClone(RESUME_DEFAULT.content))
  },
  { immediate: true }
)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $adminApi('/resume', {
      method: 'PUT',
      body: { content: event.data.content }
    })

    notify.success()
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify.error({ description: err.message })
    }
  }
}
</script>
