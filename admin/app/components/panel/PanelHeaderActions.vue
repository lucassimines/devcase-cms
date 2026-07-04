<template>
  <!-- Desktop buttons -->
  <div class="hidden items-center gap-2 sm:flex">
    <UButton
      v-for="(action, index) in actions"
      :key="index"
      :icon="action.icon"
      :label="action.label"
      :color="action.color ?? 'neutral'"
      :variant="action.variant ?? 'soft'"
      :to="action.to"
      @click="onAction(action)"
    />
  </div>

  <!-- Mobile dropdown menu -->
  <UDropdownMenu class="sm:hidden" :items="dropdownItems" :content="{ align: 'end' }">
    <UButton
      icon="lucide:ellipsis-vertical"
      color="neutral"
      variant="ghost"
      :aria-label="$t('actions')"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { PanelHeaderAction } from '~/types/panel-header-action'

const props = defineProps<{
  actions: PanelHeaderAction[]
}>()

const dropdownItems = computed<DropdownMenuItem[]>(() =>
  props.actions.map((action) => ({
    label: action.label,
    icon: action.icon,
    to: action.to,
    onSelect: action.to
      ? undefined
      : () => {
          onAction(action)
        }
  }))
)

function onAction(action: PanelHeaderAction) {
  if (action.to) return

  action.onSelect?.()
}
</script>
