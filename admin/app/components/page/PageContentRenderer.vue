<template>
  <PageAbout v-if="code === 'about'" v-model="model" />
</template>

<script setup lang="ts">
import PageAbout from '~/components/page/PageAbout.vue'
import type { PageAbout as PageAboutType } from '~/types/page'

defineProps<{
  code: string
}>()

const model = defineModel<PageAboutType | null | undefined>({
  default: () => ({})
})
</script>
