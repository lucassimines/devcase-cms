<template>
  <div
    v-show="getActiveTab === slug"
    class="flex flex-col gap-5"
    :data-form-section="`form-section-${slug}`"
  >
    <div class="flex flex-col gap-2">
      <h1 class="font-medium text-toned" v-text="resolvedTitle" />
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

const slug = computed(() => {
  return toSlug(resolvedTitle.value)
})

const { t } = useI18n()

const defaultTitle = t('general')

const resolvedTitle = computed(() => {
  return props.title || defaultTitle
})

onMounted(async () => {
  await nextTick()

  addTab({
    label: resolvedTitle.value,
    value: slug.value,
    icon: props.icon,
    to: `?tab=${slug.value}`
  })
})
</script>
