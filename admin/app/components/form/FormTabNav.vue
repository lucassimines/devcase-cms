<template>
  <nav v-if="tabs.length > 1" class="flex gap-1">
    <UButton
      v-for="tab in tabs"
      :key="tab.value"
      :label="tab.label"
      :icon="tab.icon"
      :variant="getActiveTab === tab.value ? 'soft' : 'ghost'"
      :color="getActiveTab === tab.value ? 'primary' : 'neutral'"
      :to="tab.to"
      @click="activeTab = tab.value"
    />
  </nav>
</template>

<script setup lang="ts">
import type { FormTab } from '~/types/form'

const props = defineProps<{
  tabs: FormTab[]
}>()

const { getActiveTab, resetTabs, activeTab } = useFormTabs()

onUnmounted(() => {
  resetTabs()
})

const route = useRoute()

onMounted(() => {
  activeTab.value = route.query.tab?.toString() || props.tabs[0]?.value || ''
})
</script>
