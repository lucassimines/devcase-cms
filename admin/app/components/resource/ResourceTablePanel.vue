<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <slot name="header-left">
            <UBreadcrumb :items="normalizedBreadcrumbs" />
          </slot>
        </template>

        <template #right>
          <slot name="header-right" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <slot />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts" generic="T extends { id?: string | number; name?: string; slug?: string }">
import type { BreadcrumbItem } from '@nuxt/ui'

const props = defineProps<{
  breadcrumbs?: BreadcrumbItem[]
}>()

const { breadcrumbs: defaultBreadcrumbs } = useBreadcrumbs()

const normalizedBreadcrumbs = computed(() => {
  return props.breadcrumbs ?? defaultBreadcrumbs.value ?? []
})
</script>
