<template>
  <NuxtLayout name="panel">
    <template #header-left>
      <slot name="left">
        <UBreadcrumb :items="normalizedBreadcrumbs" class="max-md:hidden" />
      </slot>
    </template>

    <template #header-right>
      <slot name="right" />
    </template>

    <template v-if="tabs?.length" #toolbar>
      <FormTabNav :tabs="tabs" />

      <div class="flex justify-end items-center gap-6 grow">
        <USwitch v-if="hasZodSchemaProp(schema, 'published')" v-model="state.published" />

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
      v-else-if="item"
      ref="formRef"
      :schema="schema"
      :state="state"
      class="space-y-4"
      :loading-auto="false"
      @submit="onSubmit"
      @error="onError"
    >
      <slot :state="state" />

      <!-- Placeholder to submit the form on enter key press -->
      <button type="submit" class="hidden" />
    </UForm>
  </NuxtLayout>
</template>

<script setup lang="ts" generic="T">
import type { BreadcrumbItem, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'
import type { FormModel, ModelInput } from '~/types/utils'

const props = defineProps<{
  schema: z.ZodSchema<T>
  endpoint: string
  breadcrumbs?: BreadcrumbItem[]
}>()

const { entity, setEntity } = useEntity<ModelInput<T>>()

defineSlots<{
  left: () => VNode
  right: () => VNode
  default: (props: { state: ModelInput<T> }) => VNode
}>()

const { breadcrumbs: defaultBreadcrumbs } = useBreadcrumbs()

const normalizedBreadcrumbs = computed(() => {
  return props.breadcrumbs ?? defaultBreadcrumbs.value ?? []
})

const { t } = useI18n()

const notify = useNotification()

type Schema = z.output<typeof props.schema>

const formRef = useTemplateRef('formRef')

const { tabs } = useFormTabs()

const state = ref() as Ref<ModelInput<Schema>>

const { data: item, status } = await useAdminApi<FormModel<T>>(props.endpoint)

const { mergeState, deepNormalizeArrays } = useSchema<T>()

function onError(event: FormErrorEvent) {
  console.log('Validation errors:', event.errors)
}

watch(item, (newItem) => {
  if (!newItem) return

  const parsed = props.schema.safeParse({})
  const schemaDefaults = parsed.success
    ? (parsed.data as ModelInput<Schema>)
    : ({} as ModelInput<Schema>)
  const defaultState = deepNormalizeArrays(schemaDefaults)

  state.value = mergeState(defaultState as T, newItem as T) as ModelInput<Schema>

  setEntity(state.value)
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const res = await $adminApi<FormModel<T>>(props.endpoint, {
      method: 'PUT',
      body: event.data as FormModel<T>
    })

    if (res?.id) {
      notify.success()
      item.value = res as unknown as typeof item.value
      return
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify.error({ description: err.message })
    }
  }
}

onUnmounted(() => {
  entity.value = null
})
</script>
