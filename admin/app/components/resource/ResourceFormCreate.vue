<template>
  <UModal v-model:open="open" :title="title">
    <UButton icon="lucide:plus" :label="title" variant="soft" />

    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <FieldText v-model="state.name" :label="$t('name')" name="name" translate />

        <UFormField v-if="hasSlug" :label="$t('slug')" name="slug">
          <UInput v-model="state.slug" />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            :label="$t('button.cancel')"
            color="neutral"
            variant="subtle"
            size="lg"
            @click="open = false"
          />
          <UButton
            :label="$t('button.create')"
            icon="lucide:plus"
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
import type { FormModel } from '~/types/utils'

const props = defineProps<{
  title: string
  endpoint: string
  hasSlug?: boolean
}>()

const { toSlug } = useHelpers()

const { $tr } = useNuxtApp()

const formSchema = z.object({
  name: localizedStringSchema(),
  slug: z.string().optional().or(z.literal(''))
})

const schema = formSchema.transform((data) => ({
  ...data,
  slug: data.slug?.length ? toSlug(data.slug) : toSlug($tr(data.name))
}))

type Schema = z.output<typeof schema>

type FormState = Pick<Schema, 'name'> & {
  slug?: string
}

const state = reactive<FormState>({
  name: emptyLocalizedString(),
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
