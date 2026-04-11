<template>
  <nav v-if="tabs.length > 1" class="flex flex-wrap gap-2 justify-center">
    <UButton
      v-for="tab in tabs"
      :key="tab.value"
      :label="tab.label"
      :icon="tab.icon"
      :variant="getActiveTab === tab.value ? 'soft' : 'ghost'"
      :color="getActiveTab === tab.value ? 'primary' : 'neutral'"
      @click="getActiveTab = tab.value"
    />
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  tabs: FormTab[]
}>()

const { getActiveTab, resetTabs } = useFormTabs()

onUnmounted(() => {
  resetTabs()
})
</script>
