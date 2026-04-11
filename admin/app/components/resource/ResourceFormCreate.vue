<template>
  <UModal v-model:open="open" :title="title">
    <UButton icon="i-lucide-plus" :label="title" variant="soft" />

    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" class="w-full" size="xl" />
        </UFormField>

        <UFormField v-if="hasSlug" label="Slug" name="slug">
          <UInput v-model="state.slug" class="w-full" size="xl" />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            :label="t('cancel')"
            color="neutral"
            variant="subtle"
            size="lg"
            @click="open = false"
          />
          <UButton
            :label="t('create')"
            icon="i-lucide-plus"
            color="primary"
            variant="subtle"
            size="lg"
            type="submit"
            loading-auto
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts" generic="T">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const props = defineProps<{
  title: string
  endpoint: string
  hasSlug?: boolean
}>()

const { toSlug } = useHelpers()

const { t } = useI18n()

const schema = z
  .object({
    name: z.string().min(1),
    slug: z.string().optional().or(z.literal(''))
  })
  .transform((data) => ({
    ...data,
    slug: data.slug?.length ? toSlug(data.slug) : toSlug(data.name)
  }))

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: '',
  slug: ''
})

watch(
  () => state.name,
  (name) => {
    const parsed = schema.safeParse({ name })

    if (parsed.error) return

    state.slug = parsed.data.slug
  }
)

const open = ref(false)

const notify = useNotification()

const route = useRoute()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { slug, ...dataWithoutSlug } = event.data

  try {
    const res = await $adminApi<FormModel<T>>(props.endpoint, {
      method: 'POST',
      body: props.hasSlug ? event.data : dataWithoutSlug
    })

    if (res) {
      notify.success()

      // Navigate to the edit page
      navigateTo(`${route.path}/${res.id}`)

      return
    }

    notify.error()
  } catch (err: unknown) {
    notify.serverError(err)
  }
}
</script>
