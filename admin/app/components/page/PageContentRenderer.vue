<template>
  <PageAbout v-if="code === 'about'" v-model="aboutModel" />
</template>

<script setup lang="ts">
import type { PageAbout as PageAboutType } from '~/types/page'

defineProps<{
  code: string
}>()

const model = defineModel<unknown>({
  default: () => ({})
})

function isPageAbout(value: unknown): value is PageAboutType {
  if (!value || typeof value !== 'object') return false
  const candidate = value as { profile?: { title?: unknown; image?: unknown } }
  return (
    !!candidate.profile &&
    typeof candidate.profile.title === 'string' &&
    typeof candidate.profile.image === 'string'
  )
}

const aboutModel = computed<PageAboutType | null | undefined>({
  get: () => (isPageAbout(model.value) ? model.value : null),
  set: (value) => {
    model.value = value
  }
})
</script>
