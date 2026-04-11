<template>
  <div
    v-show="getActiveTab === slug"
    class="flex flex-col gap-6"
    :data-form-section="`form-section-${slug}`"
  >
    <div class="flex flex-col gap-2">
      <h1 class="font-medium text-dimmed" v-text="resolvedTitle" />
      <USeparator />
    </div>

    <UPageCard variant="subtle">
      <slot />
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  icon?: string
}>()

const { toSlug } = useHelpers()

const { addTab, getActiveTab } = useFormTabs()

const { t } = useI18n()

const defaultTitle = t('general')

const resolvedTitle = computed(() => {
  return props.title || defaultTitle
})

const slug = computed(() => {
  return toSlug(resolvedTitle.value)
})

onMounted(async () => {
  await nextTick()

  addTab({
    label: resolvedTitle.value,
    value: slug.value,
    icon: props.icon
  })
})
</script>
