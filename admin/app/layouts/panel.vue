<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <slot name="header-left" />
        </template>

        <template #right>
          <slot name="header-right" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar v-if="slots.toolbar">
        <slot name="toolbar" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div :class="{ 'flex flex-col gap-6 xl:flex-row': slots.sidebar }">
        <Container>
          <slot />
        </Container>

        <div v-if="slots.sidebar" class="w-full max-w-2xl max-xl:mx-auto xl:max-w-lg">
          <slot name="sidebar" />
        </div>
      </div>
    </template>

    <template #footer>
      <slot name="footer" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const slots = defineSlots<{
  'header-left': () => VNode
  'header-right': () => VNode
  'header-sub': () => VNode
  toolbar: () => VNode
  default: () => VNode
  sidebar: () => VNode
  footer: () => VNode
}>()
</script>
